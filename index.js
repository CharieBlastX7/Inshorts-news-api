const cheerio = require("cheerio");
const fetch = require("node-fetch");
var _ = require("lodash");

const getNews = (options, callback) => {
  var isDone = false;

  const URL = `https://inshorts.com/${options.lang}/read/${options.category}`;

  return fetch(URL)
    .then((response) => response.text())
    .then((body) => {
      const posts = [];
      const $ = cheerio.load(body);
      const scriptData = $("script").last().html();
      // const id = scriptData.match(/var min_news_id = (.*);/);
      // const newsOffsetId = _.split(id[1], '"', 3);
      const news_offset = 1 || newsOffsetId[1];

      $(".PmX01nT74iM8UNAIENsC").each((i, element) => {
        const $element = $(element);

        const title = $element
          .find(
            "div.LUWdd1C_3UqqulVsopn0 div div div span.ddVzQcwl2yPlFt4fteIE"
          )
          .text();

        const image = $element
          .find("div.GXPWASMx93K0ajwCIcCA")
          .html()
          .split("url(")[1]
          .split(")")[0];
        const author = $element
          .find(
            "div.LUWdd1C_3UqqulVsopn0 div div div.E3pJPegn7xWCOvv3BEcf span.author"
          )
          .text();

        const time = $element
          .find(
            "div.LUWdd1C_3UqqulVsopn0 div div div.E3pJPegn7xWCOvv3BEcf span[itemprop='datePublished']"
          )
          .attr("content");

        const createdAt = `${new Date(time).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "Asia/Kolkata",
        })}`;

        let content = $element
          .find("div.LUWdd1C_3UqqulVsopn0 div div div.KkupEonoVHxNv4A_D7UG")
          .text();
        const readMore = $element
          .find(
            "div.LUWdd1C_3UqqulVsopn0 div div.VW4Ta0ioG_64Xx1ROszP a.LFn0sRS51HkFD0OHeCdA"
          )
          .attr("href");

        const postData = {
          image: image,
          title: title,
          author: author,
          content: content,
          postedAt: createdAt,
          sourceURL: URL,
          readMore: readMore == undefined ? "" : readMore,
        };
        posts.push(postData);
      });
      if (!isDone) {
        callback(posts, news_offset);
        // callback(posts);
      }
      if (posts.length < 1) {
        callback({
          error: "No data found!",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
};

module.exports.getNews = getNews;

const getMoreNews = (options, callback) => {
  var isDone = false;

  const URL = `https://www.inshorts.com/${options.lang}/ajax/more_news`;

  var details = {
    category: options.category,
    news_offset: options.news_offset,
  };

  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  return fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: formBody,
  })
    .then((response) => response.json())
    .then((data) => {
      const posts = [];
      const $ = cheerio.load(data.html);
      const news_offset = data.min_news_id;

      $(".PmX01nT74iM8UNAIENsC").each((i, element) => {
        const $element = $(element);

        const title = $element
          .find(
            "div.LUWdd1C_3UqqulVsopn0 div div div span.ddVzQcwl2yPlFt4fteIE"
          )
          .text();

        const image = $element
          .find("div.GXPWASMx93K0ajwCIcCA")
          .html()
          .split("url(")[1]
          .split(")")[0];
        const author = $element
          .find(
            "div.LUWdd1C_3UqqulVsopn0 div div div.E3pJPegn7xWCOvv3BEcf span.author"
          )
          .text();

        const time = $element
          .find(
            "div.LUWdd1C_3UqqulVsopn0 div div div.E3pJPegn7xWCOvv3BEcf span"
          )
          .text();

        // const date = $element
        //   .find(
        //     "div.LUWdd1C_3UqqulVsopn0 div div div.E3pJPegn7xWCOvv3BEcf span.date"
        //   )
        //   .text();

        const createdAt = `${time}`;

        let content = $element
          .find("div.LUWdd1C_3UqqulVsopn0 div div div.KkupEonoVHxNv4A_D7UG")
          .text();
        const readMore = $element
          .find(
            "div.LUWdd1C_3UqqulVsopn0 div div.VW4Ta0ioG_64Xx1ROszP a.LFn0sRS51HkFD0OHeCdA"
          )
          .attr("href");

        const postData = {
          image: image,
          title: title,
          author: author,
          content: content,
          postedAt: createdAt,
          sourceURL: URL,
          readMore: readMore == undefined ? "" : readMore,
        };
        posts.push(postData);
      });
      if (!isDone) {
        callback(posts, news_offset);
      }
      if (posts.length < 1) {
        callback({
          error: "No data found!",
        });
      }
    })
    .catch((err) => {
      callback(err);
    });
};

module.exports.getMoreNews = getMoreNews;
