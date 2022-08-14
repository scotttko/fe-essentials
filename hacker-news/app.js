const ajax = new XMLHttpRequest();
const NEWS_URL = "https://api.hnpwa.com/v0/jobs/1.json";
const CONTENTS_URL = "https://api.hnpwa.com/v0/item/@id.json";

const container = document.getElementById("root");
const content = document.createElement("div");

ajax.open("GET", NEWS_URL, false);
ajax.send();

const newsFeed = JSON.parse(ajax.response);

const ul = document.createElement("ul");

//해쉬 변경됨을 인식하여 클릭된 뉴스 컨텐츠 fetching 
window.addEventListener("hashchange", function() {
  console.log("해쉬 변경됨");
  const id = this.location.hash.substring(1);
  ajax.open("GET", CONTENTS_URL.replace('@id', id), false);
  ajax.send();

  const newsContents = JSON.parse(ajax.response);
  console.log(newsContents);

  const title = this.document.createElement("h1");

  title.innerHTML = newsContents.title;
  content.appendChild(title);
});

for (let i = 0; i < newsFeed.length; i++) {
  const li = document.createElement("li");
  const a = document.createElement("a");

  a.href = `#${newsFeed[i].id}`;
  a.innerHTML = `${newsFeed[i].title} ${newsFeed[i].comments_count}`;
  li.appendChild(a);
  ul.appendChild(li);
}

container.appendChild(ul);
container.appendChild(content);