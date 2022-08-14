const ajax = new XMLHttpRequest();
const NEWS_URL = "https://api.hnpwa.com/v0/jobs/1.json";
const CONTENTS_URL = "https://api.hnpwa.com/v0/item/@id.json";

const container = document.getElementById("root");
const content = document.createElement("div");

function getData(url) {
  ajax.open("GET", url, false);
  ajax.send();

  return JSON.parse(ajax.response);
}

const newsFeed = getData(NEWS_URL);
const ul = document.createElement("ul");

//해쉬 변경됨을 인식하여 클릭된 뉴스 컨텐츠 fetching
window.addEventListener("hashchange", function () {
  console.log("해쉬 변경됨");
  const id = this.location.hash.substring(1);
  const newsContents = getData(CONTENTS_URL.replace("@id", id));

  console.log(newsContents);

  const title = this.document.createElement("h1");

  title.innerHTML = newsContents.title;
  content.appendChild(title);
});

for (let i = 0; i < newsFeed.length; i++) {
  const div = document.createElement("div");
  div.innerHTML = `
    <li>
      <a href="#${newsFeed[i].id}">
        ${newsFeed[i].title} ${newsFeed[i].comments_count}
      </a>
    </li>
  `;
  ul.appendChild(div.firstElementChild);
}

container.appendChild(ul);
container.appendChild(content);
