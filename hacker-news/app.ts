interface Store {
  currentPage: number;
  feeds: NewsFeed[];
}

interface News {
  readonly id: number;
  readonly time_ago: string;
  readonly title: string;
  readonly url: string;
  readonly user: string;
  readonly content: string;
}

interface NewsFeed extends News {
  readonly comments_count: number;
  readonly points: number;
  read?: boolean;
}

interface NewsDetail extends News {
  readonly comments: NewsComment[];
}

interface NewsComment extends News {
  readonly comments: NewsComment[];
  readonly level: number;
}

interface RouteInfo {
  path: string;
  page: View;
}

const ajax: XMLHttpRequest = new XMLHttpRequest();
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENTS_URL = "https://api.hnpwa.com/v0/item/@id.json";

const container: HTMLElement | null = document.getElementById("root");
// const content = document.createElement("div");
const store: Store = {
  currentPage: 1,
  feeds: [],
};

//extensd 대신 mixin 사용이유: extend는 코드에 적시되어야 하는 상속 방법 -> 유연하지 못함
// extends는 다중 상속 지원하지 않음: 여러개의 상위 클래스를 상속할 수 없음
function applyApiMixins(targetClass: any, baseClasses: any[]): void {
  baseClasses.forEach((baseClass) => {
    Object.getOwnPropertyNames(baseClass.prototype).forEach((name) => {
      const descriptor = Object.getOwnPropertyDescriptor(
        baseClass.prototype,
        name
      );

      if (descriptor) {
        Object.defineProperty(targetClass.prototype, name, descriptor);
      }
    });
  });
}

class Api {
  // url: string;
  // ajax: XMLHttpRequest;

  // constructor(url: string) {
  //   this.url = url;
  //   this.ajax = new XMLHttpRequest();
  // }

  //protected: 클래스 외부로 인스턴스 객체로 노출되지 않음
  getRequest<AjaxResponse>(url: string): AjaxResponse {
    const ajax = new XMLHttpRequest();
    ajax.open("GET", url, false);
    ajax.send();

    return JSON.parse(ajax.response);
  }
}

class NewsFeedApi {
  getData(): NewsFeed[] {
    return this.getRequest<NewsFeed[]>(NEWS_URL);
  }
}

class NewsDetailApi {
  getData(id: string): NewsDetail {
    return this.getRequest<NewsDetail>(CONTENTS_URL.replace("@id", id));
  }
}

interface NewsFeedApi extends Api {}
interface NewsDetailApi extends Api {}

applyApiMixins(NewsFeedApi, [Api]);
applyApiMixins(NewsDetailApi, [Api]);

//데이터 fetching 함수
//Generic: 호출할 때 기술된 타입을 반환하는 타입으로 사용
// function getData<AjaxResponse>(url: string): AjaxResponse {
//   ajax.open("GET", url, false);
//   ajax.send();

//   return JSON.parse(ajax.response);
// }
abstract class View {
  private template: string;
  private renderTemplate: string;
  private container: HTMLElement;
  private htmlList: string[];
  constructor(containerId: string, template: string) {
    const containerElement = document.getElementById(containerId);
    if (!containerElement) {
      throw "최상위 컨테이너가 없어 UI를 진행하지 못합니다.";
    }

    this.container = containerElement;
    this.template = template;
    this.renderTemplate = template;
    this.htmlList = [];
  }

  protected updateView(): void {
    this.container.innerHTML = this.renderTemplate;
    this.renderTemplate = this.template;
  }

  protected addHtml(htmlString: string): void {
    this.htmlList.push(htmlString);
  }

  protected getHtml(): string {
    const snapShot = this.htmlList.join("");
    this.clearHtmlList();
    return snapShot;
  }

  protected setTemplateData(key: string, value: string): void {
    this.renderTemplate = this.renderTemplate.replace(`{{__${key}__}}`, value);
  }

  private clearHtmlList(): void {
    this.htmlList = [];
  }

  abstract render(): void;
}

class Router {
  routeTable:  RouteInfo[];
  defaultRoute: RouteInfo | null;
  constructor() {
    window.addEventListener("hashchange", this.route.bind(this));

    this.routeTable = [];
    this.defaultRoute = null;
  }

  setDefaultPage(page: View): void {
    this.defaultRoute = { path: '', page};
  }

  addRoutePath(path: string, page: View): void {
    this.routeTable.push({ path, page});
  }

  route() {
    const routePath = location.hash;
    if(routePath === '' && this.defaultRoute) {
      this.defaultRoute.page.render();
    } 

    for(const routeInfo of this.routeTable) {
      if(routePath.indexOf(routeInfo.path) >= 0) {
        routeInfo.page.render();
        break;
      }
    }
  }
}

class NewsFeedView extends View {
  private api: NewsFeedApi;
  private feeds: NewsFeed[];

  constructor(containerId: string) {
    let template = `
    <div class="bg-gray-600 min-h-screen">
     <div class="bg-white text-xl">
       <div class="mx-auto px-4">
         <div class="flex justify-between items-center py-6">
           <div class="flex justify-start">
             <h1 class="font-extrabold">Hacker News</h1>
           </div>
           <div class="items-center justify-end">
             <a href="#/page/{{__prev_page__}}" class="text-gray-500">
               Previous
             </a>
             <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
               Next
             </a>
           </div>
         </div> 
       </div>
     </div>
     <div class="p-4 text-2xl text-gray-700">
       {{__news_feed__}}        
     </div>
   </div>
 `;
    super(containerId, template);
    this.api = new NewsFeedApi(); //클래스 인스턴스 사용 -> 가독성 향상
    this.feeds = store.feeds;
    // const newsList = [];

    if (this.feeds.length === 0) {
      this.feeds = store.feeds = this.api.getData();
      this.makeFeed();
    }
  }

  render(): void {
    store.currentPage = Number(location.hash.substring(7) || 1);
    for (
      let i = (store.currentPage - 1) * 10;
      i < store.currentPage * 10;
      i++
    ) {
      const { id, title, comments_count, user, points, time_ago, read } =
        this.feeds[i];
      this.addHtml(`
      <div class="p-6 ${
        read ? "bg-red-500" : "bg-white"
      } bg-white mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
        <div class="flex">
          <div class="flex-auto">
            <a href="#/show/${id}">${title}</a>  
          </div>
          <div class="text-center text-sm">
            <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${comments_count}</div>
          </div>
        </div>
        <div class="flex mt-3">
          <div class="grid grid-cols-3 text-sm text-gray-500">
            <div><i class="fas fa-user mr-1"></i>${user}</div>
            <div><i class="fas fa-heart mr-1"></i>${points}</div>
            <div><i class="far fa-clock mr-1"></i>${time_ago}</div>
          </div>  
        </div>
      </div>   
  `);
    }

    this.setTemplateData("news_feed", this.getHtml());
    this.setTemplateData(
      "prev_page",
      String(store.currentPage > 1 ? store.currentPage - 1 : 1)
    );
    this.setTemplateData(
      "next_page",
      String(
        store.currentPage * 10 >= this.feeds.length
          ? store.currentPage
          : store.currentPage + 1
      )
    );

    this.updateView();
  }

  private makeFeed(): void {
    for (let i = 0; i < this.feeds.length; i++) {
      this.feeds[i].read = false;
    }
  }
}

//읽음 표시 위한 데이터 추가 함수
function makeFeed(feeds: NewsFeed[]): NewsFeed[] {
  for (let i = 0; i < feeds.length; i++) {
    feeds[i].read = false;
  }
  return feeds;
}

class NewsDetailView extends View {
  constructor(containerId: string) {
    let template = `
      <div class="bg-gray-600 min-h-screen pb-8">
        <div class="bg-white text-xl">
          <div class="mx-auto px-4">
            <div class="flex justify-between items-center py-6">
              <div class="flex justify-start">
                <h1 class="font-extrabold">Hacker News</h1>
              </div>
              <div class="items-center justify-end">
                <a href="#/page/{{__currentPage__}}" class="text-gray-500">
                  <i class="fa fa-times"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
  
        <div class="h-full border rounded-xl bg-white m-6 p-4 ">
          <h2>{{__title__}}</h2>
          <div class="text-gray-400 h-20">
            {{__content__}}
          </div>
          {{__comments__}}
        </div>
      </div>
    `;
    super(containerId, template);
  }

  render() {
    const id = location.hash.substring(7); //# 제거
    const api = new NewsDetailApi();
    const newsContent = api.getData(id);

    //읽은 글의 읽음 표시
    for (let i = 0; i < store.feeds.length; i++) {
      if (store.feeds[i].id === Number(id)) {
        store.feeds[i].read = true;
        break;
      }
    }

    this.setTemplateData("comments", this.makeComment(newsContent.comments));
    this.setTemplateData("currentPage", String(store.currentPage));
    this.setTemplateData("title", newsContent.title);
    this.setTemplateData("content", newsContent.content);

    this.updateView();
  }

  makeComment(comments: NewsComment[]): string {
    for (let i = 0; i < comments.length; i++) {
      const comment: NewsComment = comments[i];
      this.addHtml(`
         <div style="padding-left: ${comment.level * 40}px;" class="mt-4">
          <div class="text-gray-400">
            <i class="fa fa-sort-up mr-2"></i>
            <strong>${comment.user}</strong> ${comment.time_ago}
          </div>
          <p class="text-gray-700">${comment.content}</p>
        </div>      
      `);

      if (!!comment.comments.length) {
        this.addHtml(this.makeComment(comment.comments));
      }
    }

    return this.getHtml();
  }
}

function updateView(html: string): void {
  //type guard
  if (container) {
    container.innerHTML = html;
  } else {
    console.error("최상위 컨테이너가 없어 UI를 진행하지 못합니다.");
  }
}

function newsFeed(): void {
  const api = new NewsFeedApi(); //클래스 인스턴스 사용 -> 가독성 향상
  let newsFeed: NewsFeed[] = store.feeds;
  const newsList = [];
  let template = `
     <div class="bg-gray-600 min-h-screen">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                Previous
              </a>
              <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                Next
              </a>
            </div>
          </div> 
        </div>
      </div>
      <div class="p-4 text-2xl text-gray-700">
        {{__news_feed__}}        
      </div>
    </div>
  `;

  if (newsFeed.length === 0) {
    newsFeed = store.feeds = makeFeed(api.getData());
  }

  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    newsList.push(`
      <div class="p-6 ${
        newsFeed[i].read ? "bg-red-500" : "bg-white"
      } bg-white mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
        <div class="flex">
          <div class="flex-auto">
            <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>  
          </div>
          <div class="text-center text-sm">
            <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${
              newsFeed[i].comments_count
            }</div>
          </div>
        </div>
        <div class="flex mt-3">
          <div class="grid grid-cols-3 text-sm text-gray-500">
            <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
            <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
            <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
          </div>  
        </div>
      </div>   
  `);
  }

  template = template.replace("{{__news_feed__}}", newsList.join(""));
  template = template.replace(
    "{{__prev_page__}}",
    String(store.currentPage > 1 ? store.currentPage - 1 : 1)
  );
  template = template.replace(
    "{{__next_page__}}",
    String(
      store.currentPage * 10 >= newsFeed.length
        ? store.currentPage
        : store.currentPage + 1
    )
  );

  updateView(template);
}

function makeComment(comments: NewsComment[]): string {
  const commentString = [];
  for (let i = 0; i < comments.length; i++) {
    const comment: NewsComment = comments[i];
    commentString.push(`
       <div style="padding-left: ${comment.level * 40}px;" class="mt-4">
        <div class="text-gray-400">
          <i class="fa fa-sort-up mr-2"></i>
          <strong>${comment.user}</strong> ${comment.time_ago}
        </div>
        <p class="text-gray-700">${comment.content}</p>
      </div>      
    `);

    if (!!comment.comments.length) {
      commentString.push(makeComment(comment.comments));
    }
  }

  return commentString.join("");
}

function newsDetail(): void {
  const id = location.hash.substring(7); //# 제거
  const api = new NewsDetailApi();
  const newsContent = api.getData(id);
  let template = `
    <div class="bg-gray-600 min-h-screen pb-8">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/${store.currentPage}" class="text-gray-500">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="h-full border rounded-xl bg-white m-6 p-4 ">
        <h2>${newsContent.title}</h2>
        <div class="text-gray-400 h-20">
          ${newsContent.content}
        </div>

        {{__comments__}}

      </div>
    </div>
  `;

  //읽은 글의 읽음 표시
  for (let i = 0; i < store.feeds.length; i++) {
    if (store.feeds[i].id === Number(id)) {
      store.feeds[i].read = true;
      break;
    }
  }

  updateView(
    template.replace("{{__comments__}}", makeComment(newsContent.comments))
  );
}

// function router(): void {
//   const routePath = location.hash;
//   console.log(routePath);
//   if (routePath === "") {
//     newsFeed();
//   } else if (routePath.indexOf("#/page/") >= 0) {
//     store.currentPage = Number(routePath.substring(7));
//     newsFeed();
//   } else {
//     newsDetail();
//   }
// }

// window.addEventListener("hashchange", router);

// router();

const router: Router = new Router();
const newsFeedView = new NewsFeedView('root');
const newsDetailView = new NewsDetailView('root');

router.setDefaultPage(newsFeedView);
router.addRoutePath('/page/', newsFeedView);
router.addRoutePath('/show/', newsDetailView);

router.route();