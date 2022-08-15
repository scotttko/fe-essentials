const ajax = new XMLHttpRequest();
const NEWS_URL = "https://api.hnpwa.com/v0/jobs/1.json";
const CONTENTS_URL = "https://api.hnpwa.com/v0/item/@id.json";

const container = document.getElementById("root");
// const content = document.createElement("div");

function getData(url) {
  ajax.open("GET", url, false);
  ajax.send();

  return JSON.parse(ajax.response);
}

function newsFeed() {
  const newsFeed = getData(NEWS_URL);
  const newsList = [];

  newsList.push("<ul>");
  for (let i = 0; i < newsFeed.length; i++) {
    newsList.push(`
    <li>
      <a href="#${newsFeed[i].id}">
        ${newsFeed[i].title} ${newsFeed[i].comments_count}
      </a>
    </li>
  `);
  }

  newsList.push("</ul>");

  container.innerHTML = newsList.join("");
}

function newsDetail() {
  const id = location.hash.substring(1); //# 제거
  const newsContents = getData(CONTENTS_URL.replace("@id", id));

  container.innerHTML = `
    <h1>${newsContents.title}</h1>
    <div>
      <a href="#">목록으로</a>
    </div>
  `;
}

function router() {
  const routePath = location.hash;
  console.log(routePath);
  if (routePath === "") {
    newsFeed();
  } else {
    newsDetail();
  }
}

window.addEventListener("hashchange", router);

router();
