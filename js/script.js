const results = document.querySelector(".results");
const navEl = document.querySelectorAll(".nav-el");
const next = document.querySelector(".next");
const prev = document.querySelector(".prev");
const navList = document.querySelector(".nav-list");
const searchBtn = document.querySelector(".search-btn");
const searchBox = document.querySelector(".search-box");
const showBookmarksBtn = document.querySelector(".show-bookmarks-btn");
const hamburger = document.querySelector(
  ".NavigationStyles__HamburgerButton-sc-zlirk0-6"
);
let followerCount = document.querySelector(".follower-count");
let likedCount = document.querySelector(".liked-count");
let totalFollowers = 0;
let totalLikes = 0;
let isClicked = false;
const showFollowingBtn = document.querySelector(".show-following-posts");
const showFollowings = document.querySelector(".following-list");
const showLikedPosts = document.querySelector(".show-liked-posts");
const websiteLogo = document.querySelector(".website-logo");
const stickyBottomElements = document.querySelectorAll(".sticky-bottom-el");
const homebtn = document.querySelector(".fa-house");
const locationResults = $(".location-results");
const country = $(".location-wrapper");
const countriesBtn = document.getElementsByClassName("location-country");
let savedPages = [];
let likedPosts = [];
let followingList = [];
const cardColors = [
  "#fff2c5",
  "#fff8dd",
  "#fbe5e1",
  "#e1f0ff",
  "#eae4fd",
  "#ce93d8",
  "#42a5f5",
  "#57373",
];

let countries = {
  ae: "Arab Emiarates",
  ar: "Argentina",
  at: "Austria",
  au: "Australia",
  be: "Belgium",
  bg: "Bulgaria",
  br: "Brazil",
  ca: "Canada",
  ch: "Switzerland",
  cn: "China",
  co: "Colombia",
  cu: "cuba",
  cz: "Czech Republic",
  de: "Germany",
  eg: "Egypt",
  fr: "France",
  gb: "United Kingdom",
  gr: "Greece",
  hk: "Hong Kong",
  hu: "Hungary",
  id: "Indonesia",
  ie: "Ireland",
  il: "Israel",
  in: "India",
  it: "Italy",
  jp: "Japan",
  kr: "South Korea",
  lt: "Lithuania",
  lv: "Latvia",
  ma: "Morocco",
  mx: "Mexico",
  my: "Malaysia",
  ng: "Nigeria",
  nl: "Netherlands",
  no: "Norway",
  nz: "New Zealand",
  ph: "Philippines",
  pl: "Poland",
  pt: "Portugal",
  ro: "Romania",
  rs: "Serbia",
};

// console.log();
let selectedCountry = "in";
const url =
  "https://newsapi.org/v2/top-headlines?country=in&apiKey=cf27305c4df349489f7200b4cdcf01b3";

/*
    @Function: prefetch
    @Description: fetch data from api
    @Param: url of api
    @Returns: fetched data in json format
*/
async function prefetch(url) {
  // showLoader();
  let news = await fetch(url);
  let newsData = await news.json();
  return newsData;
}
const locationResultsId = document.getElementById("location-results");
async function init() {
  let newsData = await prefetch(url);

  country.on("click", showLocationResults);
  function showLocationResults() {
    locationResults.toggleClass("toggle-display");
  }

  for (const value of Object.values(countries)) {
    const box = `<span class="location-country">${value}</span>`;
    locationResultsId.innerHTML += box;
    console.log(value);
  }

  /*
    @Function: showToast
    @Description: brings out side panel on clicking on hamburger
    @Param: null    
    @Returns: null
*/
  function showToast(message, duration) {
    var toast = document.getElementById("toast");
    toast.innerText = message;
    toast.classList.add("show");

    setTimeout(function () {
      toast.classList.remove("show");
    }, duration);
  }

  //for making active class on click on bottom sticky buttons
  for (var i = 0; i < stickyBottomElements.length; i++) {
    stickyBottomElements[i].addEventListener("click", function (e) {
      e.preventDefault();
      for (var i = 0; i < stickyBottomElements.length; i++) {
        stickyBottomElements[i].classList.remove("active-sticky-bottom");
      }
      this.classList.add("active-sticky-bottom");
    });
  }

  //for making active class on hover and click on navigation elements
  navEl[i].addEventListener("click", function (e) {
    e.preventDefault();
    for (var i = 0; i < navEl.length; i++) {
      navEl[i].classList.remove("active");
    }
    this.classList.add("active");
  });
  for (var i = 0; i < navEl.length; i++) {
    navEl[i].addEventListener("mouseover", function (e) {
      e.preventDefault();
      for (var i = 0; i < navEl.length; i++) {
        navEl[i].classList.remove("active");
      }
      this.classList.add("active");
    });
    navEl[i].addEventListener("click", function (e) {
      e.preventDefault();
      for (var i = 0; i < navEl.length; i++) {
        navEl[i].classList.remove("active");
      }
      this.classList.add("active");
    });
  }

  //for toggling between page headings
  $(".show-bookmarks-btn").on("click", function () {
    // Usage
    showToast("Showing Saved Pages", 3000);
    $(".saved-pages").toggle();
    $(".website-logo").toggle();
  });
  $(".show-following-posts").on("click", function () {
    $(".following-page").toggle();
    $(".website-logo").toggle();
  });

  /*
    @Function: openSidePanel
    @Description: brings out side panel on clicking on hamburger
    @Param: null    
    @Returns: null
*/
  // function openSidePanel()
  // {
  //     navList.classList.toggle('show-nav');
  // }
  hamburger.addEventListener("click", openSidePanel);
  function openSidePanel() {
    locationResultsId.classList.remove("toggle-display");
    console.log("Asdsad");
    if (isClicked) {
      navList.style.left = "-100vw";
      hamburger.classList.remove("eNNFmn");
      hamburger.classList.add("lbwthk");

      isClicked = false;
    } else {
      navList.style.left = "0vw";

      hamburger.classList.remove("lbwthk");
      hamburger.classList.add("eNNFmn");

      isClicked = true;
    }
  }

  generateNewsCards(newsData);
  /*
    @Function: generateNewsCards
    @Description: contains all the functionalities after data is fetched from api
    @Param: null
    @Returns: null
*/
  function generateNewsCards(newsData) {
    showToast("Showing news from " + countries[selectedCountry], 3000);
    cardNumber = -1;
    //adding event listener on the home button to go to home page
    homebtn.addEventListener("click", function () {
      console.log(newsData.length);
      showFollowings.innerHTML = "";
      cardNumber = -1;
      printNextCard();
    });

    let timeexecuted = 1;

    for (var i = 0; i < countriesBtn.length; i++) {
      countriesBtn[i].addEventListener("mouseover", function () {
        console.log("banda");
        for (var i = 0; i < countriesBtn.length; i++) {
          countriesBtn[i].classList.remove("hovered-country");
        }
        this.classList.add("hovered-country");
      });
    }
    //event bubbling
    locationResultsId.addEventListener("click", showCountryNews);

    async function showCountryNews(e) {
      console.log(e.target);
      timeexecuted++;
      console.log(timeexecuted);
      results.innerHTML = "";
      document.querySelector(".active-location").innerHTML = e.target.innerHTML;
      document.querySelector(".selected-country").innerHTML =
        e.target.innerHTML;
      function getKeyFromValue(obj, searchValue) {
        for (const [key, value] of Object.entries(obj)) {
          if (value === searchValue) {
            return key;
          }
        }
        return null; // Return null if the value is not found in the object
      }
      selectedCountry = getKeyFromValue(countries, e.target.innerHTML);

      let newsData = await prefetch(
        `https://newsapi.org/v2/top-headlines?country=${selectedCountry}&apiKey=cf27305c4df349489f7200b4cdcf01b3`
      );
      cardNumber = -1;
      console.log(newsData["articles"]);
      next.removeEventListener("click", printNextCard);
      prev.removeEventListener("click", printPrevCard);
      generateNewsCards(newsData);
    }

    //event listeners on next and previous buttons
    next.addEventListener("click", printNextCard);
    prev.addEventListener("click", printPrevCard);

    //display searchbar when clicked on search button
    searchBtn.addEventListener("click", function () {
      searchBox.style.display = "flex";
      searchBox.focus();
    });

    searchBox.addEventListener("change", searchFunction);
    showBookmarksBtn.addEventListener("click", showBookmarks);

    /*
    @Function: showBookmarks
    @Description: displays all the saved articles
    @Param: none
    @Returns: none
*/
    function showBookmarks() {
      results.innerHTML = "";
      console.log("bookmarks showing");
      if (savedPages.length == 0) {
        results.innerHTML = "";
        const box = `
                <p class="error">you haven't saved any news articles.</p>
                `;
        results.innerHTML += box;
      } else {
        for (var i = 0; i < savedPages.length; i++) {
          printSavedCard(i, savedPages);
        }
      }
    }

    //to show all the liked articles in the website
    showLikedPosts.addEventListener("click", function (e) {
      e.preventDefault();
      navList.style.left = "-100vw";
      isClicked = false;
      hamburger.classList.remove("eNNFmn");
      hamburger.classList.add("lbwthk");
      showToast("Showing Liked Articles", 3000);
      navList.classList.toggle("show-nav");
      results.innerHTML = "";
      for (var i = 0; i < likedPosts.length; i++) {
        printSavedCard(i, likedPosts);
      }
    });

    //to show all the followed authors in the website
    showFollowingBtn.addEventListener("click", function (e) {
      e.preventDefault();
      navList.style.left = "-100vw";
      isClicked = false;
      hamburger.classList.remove("eNNFmn");
      hamburger.classList.add("lbwthk");

      showToast("Showing Followed Authors", 3000);
      navList.classList.toggle("show-nav");
      showFollowings.innerHTML = "";

      results.innerHTML = "";

      for (var i = 0; i < followingList.length; i++) {
        showFollowingsFunction(i);
      }
    });

    /*
    @Function: showFollowingFunction
    @Description: prints each followed author
    @Param: index of card 
    @Returns: null
*/

    function showFollowingsFunction(i) {
      if (followingList.length != 0) {
        if (followingList.includes(followingList[i])) {
          const box = `<li class="following-author">
                    <span class="following-author-name">${followingList[i]}</span>
                    <button class="follow button">follow</button>
                </li>`;
          showFollowings.innerHTML += box;
          const followBtn = document.querySelectorAll(".follow");
          const followingAuthor =
            document.querySelectorAll(".following-author");
          const followingAuthorName = document.querySelectorAll(
            ".following-author-name"
          );
          for (var i = 0; i < followBtn.length; i++) {
            if (followingList.includes(followingAuthorName[i].innerHTML)) {
              followBtn[i].innerHTML = "following";
            } else {
              followBtn[i].innerHTML = "follow";
            }
          }
          for (var i = 0; i < followingAuthor.length; i++) {
            followingAuthor[i].addEventListener("click", function () {
              showFollowings.innerHTML = "";
              for (var j = 0; j < newsData["articles"].length; j++) {
                console.log(this);
                if (
                  newsData["articles"][j]["author"] ==
                  this.children[0].innerHTML
                ) {
                  printThisNewsCard(j);
                }
              }
            });
          }
          for (var i = 0; i < followBtn.length; i++) {
            followBtn[i].addEventListener("click", function () {
              if (
                followingList.includes(this.parentNode.children[0].innerHTML)
              ) {
                showToast("Unfollowed", 3000);
                this.innerHTML = "follow";
                var followedItemIndex = followingList.indexOf(
                  this.parentNode.children[0].innerHTML
                );
                followingList.splice(followedItemIndex, 1);
                console.log(followingList);
              } else {
                showToast("Followed", 3000);
                this.innerHTML = "following";
                followingList.push(this.parentNode.children[0].innerHTML);
                console.log(followingList);
              }
            });
          }

          for (var i = 0; i < followingAuthor.length; i++) {
            followingAuthor[i].style.backgroundColor =
              cardColors[Math.floor(Math.random() * cardColors.length)];
          }
        }
      } else {
        const box = `<li class="following-author">
                <span class="following-author-name">Start following</span>
            </li>`;
        showFollowings.innerHTML += box;
      }
    }

    function showLoader() {
      results.innerHTML = `<div class="spinner-box">
      <div class="configure-border-1">
        <div class="configure-core"></div>
      </div>
      <div class="configure-border-2">
        <div class="configure-core"></div>
      </div>
    </div>`;
    }

    /*
    @Function: searchFunction
    @Description: searches for keywords from fetched api and prints news cards
    @Param: null
    @Returns: null
*/
    async function searchFunction() {
      // results.innerHTML = "";
      showLoader();
      showFollowings.innerHTML = "";
      let string = searchBox.value;
      newsData = await prefetch(
        `https://newsapi.org/v2/everything?q=${string}&apiKey=cf27305c4df349489f7200b4cdcf01b3`
      );
      generateNewsCards(newsData);

      // console.log();
    }
    /*
    @Function: printPrevCard
    @Description: prints previous card when clicked on prev button
    @Param: null 
    @Returns: null
*/
    function printPrevCard() {
      // cardNumber-=1;
      if (cardNumber == 0) {
        showToast("Reached begining of page", 3000);
      } else {
        results.innerHTML = "";
        cardNumber--;
        printThisNewsCard(cardNumber);
      }
    }

    /*
    @Function: printNextCard
    @Description: prints next card when clicked on next button
    @Param: null 
    @Returns: null
*/

    printNextCard();

    function printNextCard() {
      console.log(cardNumber);
      if (cardNumber < newsData["articles"].length - 1) {
        results.innerHTML = "";
        cardNumber++;
        printThisNewsCard(cardNumber);
        console.log(cardNumber);
      } else {
        showToast("Reached end of articles", 3000);
      }
    }

    /*
    @Function: removeCharactersAfterHyphen
    @Description: removes all character after last occuring hyphen in the title of the news card
    @Param: title of news card in form of string
    @Returns: string with removed hyphen
*/
    function removeCharactersAfterHyphen(str) {
      const hyphenIndex = str.lastIndexOf("-");
      if (hyphenIndex !== -1) {
        return str.substring(0, hyphenIndex);
      }
      return str;
    }

    /*
    @Function: printSavedCard
    @Description: prints saved card after being bookmarked
    @Param: index of card & savedPages array 
    @Returns: null
*/
    function printSavedCard(i, savedPages) {
      const box = `
            <div class="news-card">
                    <div class="news-title">${removeCharactersAfterHyphen(
                      savedPages[i]["title"]
                    )}</div>
                    

                    <div class="know-more-like-share-wrapper">
                        <button class="know-more button">know more</button>
                        <div class="like-components">
                            <i class="fa-regular fa-thumbs-up post-like"></i>
                            <i class="fa-solid fa-bookmark post-bookmark"></i>
                            <i class="fa-solid fa-share"></i>
                        </div>
                    </div>
                </div>
            `;
      results.innerHTML += box;

      console.log(savedPages);
    }

    /*
    @Function: printThisNewsCard
    @Description: prints a specific news card 
    @Param: index of the card 
    @Returns: null
*/
    function printThisNewsCard(i) {
      const box = `
            <div class="news-card">
                    <div class="news-title">${removeCharactersAfterHyphen(
                      newsData["articles"][i]["title"]
                    )}</div>
                    <span class="updated-time">updated just now.</span>
                    <div class="author-details">
                        <div class="author-prof-pic-name-wrapper">
                            <div class="author-prof-pic">
                                <img src="/assets/subha_kant-28-02-2023-0001_2 (1) (1).jpg" alt="user image" loading='lazy'>
                            </div>
                            <div class="author-name-wrapper">
                                <span>published by</span>
                                <span class="author-name">${
                                  newsData["articles"][i]["author"]
                                }</span>
                            </div>
                        </div>

                        <button class="follow button">follow</button>
                    </div>
                    <p class="news-content">
                    ${checkDescriptionNull(
                      newsData["articles"][i]["description"]
                    )}
                    </p>

                    <div class="know-more-like-share-wrapper">
                        <a href='${
                          newsData["articles"][i]["url"]
                        }' target="_blank" ><button class="know-more button">know more</button></a>
                        <div class="like-components">
                            <i class="fa-regular fa-thumbs-up post-like"></i>
                            <i class="fa-regular fa-bookmark post-bookmark"></i>
                            <i class="fa-solid fa-share"></i>
                        </div>
                    </div>
                </div>
            `;

      results.innerHTML += box;
      const newsCard = document.querySelector(".news-card");
      const bookmarkBtn = document.querySelector(".post-bookmark");
      const postLike = document.querySelector(".post-like");
      const followBtn = document.querySelector(".follow");

      /*
    @Function: checkDescription
    @Description: checks if the description of the news article is null, if it is, title of the article is returned
    @Param: description of the article
    @Returns: string (either article title/description)
*/
      function checkDescriptionNull(str) {
        if (str == null) {
          return removeCharactersAfterHyphen(newsData["articles"][i]["title"]);
        } else {
          return str;
        }
      }

      //recoloring the present element in following list array
      if (followingList.includes(newsData["articles"][i]["author"])) {
        followBtn.innerHTML = "following";
      } else {
        followBtn.innerHTML = "follow";
      }

      //recoloring the present element in liked posts list array
      if (likedPosts.includes(newsData["articles"][i])) {
        postLike.style.fontWeight = 600;
      } else {
        postLike.style.fontWeight = 100;
      }

      //recoloring the present element in saved list array
      if (savedPages.includes(newsData["articles"][i])) {
        bookmarkBtn.style.fontWeight = 600;
      } else {
        bookmarkBtn.style.fontWeight = 100;
      }

      //adding/removing  to the follow list array on click
      followBtn.addEventListener("click", function () {
        if (followingList.includes(newsData["articles"][i]["author"])) {
          showToast("Unfollowed", 3000);

          followerCount.innerHTML = --totalFollowers;
          followBtn.innerHTML = "follow";
          var followedItemIndex = followingList.indexOf(
            newsData["articles"][i]["author"]
          );
          followingList.splice(followedItemIndex, 1);
          console.log(followingList);
        } else {
          showToast("Following", 3000);
          followerCount.innerHTML = ++totalFollowers;
          followBtn.innerHTML = "following";
          followingList.push(newsData["articles"][i]["author"]);
          console.log(followingList);
        }
      });

      //adding/removing  to the post like list array on click
      postLike.addEventListener("click", function () {
        if (likedPosts.includes(newsData["articles"][i])) {
          showToast("Unliked", 3000);
          likedCount.innerHTML = --totalLikes;
          postLike.style.fontWeight = 100;
          likedPosts.pop(i);
        } else {
          showToast("Liked", 3000);
          likedCount.innerHTML = ++totalLikes;
          postLike.style.fontWeight = 600;
          likedPosts.push(newsData["articles"][i]);
        }
        console.log(likedPosts);
      });

      //adding/removing  to the bookmark list array on click
      bookmarkBtn.addEventListener("click", function () {
        if (savedPages.includes(newsData["articles"][i])) {
          showToast("Unsaved", 3000);
          bookmarkBtn.style.fontWeight = 100;
          savedPages.pop(i);
        } else {
          showToast("Saved", 3000);
          bookmarkBtn.style.fontWeight = 600;
          savedPages.push(newsData["articles"][i]);
        }
      });
      newsCard.style.backgroundColor =
        cardColors[Math.floor(Math.random() * cardColors.length)];
    }
  }
}

//initiating the code after DOM is ready
window.addEventListener("DOMContentLoaded", init);
