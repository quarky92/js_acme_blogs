//1
function createElemWithText(type = "p", text, className) {
    const e = document.createElement(type);
    e.textContent = text;

    if (className) e.classList.add(className);

    return e;
}

//2
function createSelectOptions(data) {
    const arr = [];

    if (!data) return undefined;

    data.forEach((d) => {
        const e = document.createElement("option");
        e.value = d.id;
        e.textContent = d.name;

        arr.push(e);
    });

    return arr;
}

//3
function toggleCommentSection(postId) {
    if (!postId) return undefined;

    const e = document.querySelector(`section[data-post-id="${postId}"]`);

    if (e) {
        e.classList.toggle("hide");
    }

    return e;
}

//4
function toggleCommentButton(postId) {
    if (!postId) return undefined;

    const e = document.querySelector(`button[data-post-id="${postId}"]`);

    if (e)
        e.textContent =
            e.textContent == "Show Comments"
                ? "Hide Comments"
                : "Show Comments";

    return e;
}

//5
function deleteChildElements(p) {
    if (!p || !(p instanceof HTMLElement)) return undefined;

    let child = p.lastElementChild;

    while (child) {
        p.removeChild(child);
        child = p.lastElementChild;
    }

    return p;
}

//6
function addButtonListeners() {
    const buttons = document.querySelectorAll("main button");
    buttons.forEach((b) => {
        const id = b.dataset.postId;
        if (id) {
            //   console.log(id);
            b.addEventListener(
                "click",
                (e) => {
                    toggleComments(e, id);
                },
                false
            );
        }
    });

    return buttons;
}

//7
function removeButtonListeners() {
    const buttons = document.querySelectorAll("main button");
    buttons.forEach((b) => {
        const id = b.dataset.postId;
        if (id) {
            b.removeEventListener("click", (e) => {
                toggleComments(e, id);
            });
        }
    });
    return buttons;
}

//8
function createComments(json) {
    if (!json) return undefined;

    const frag = document.createDocumentFragment();

    json.forEach((comment) => {
        const a = document.createElement("article");
        const h3 = createElemWithText("h3", comment.name);
        const p1 = createElemWithText("p", comment.body);
        const p2 = createElemWithText("p", `From: ${comment.email}`);
        a.append(h3, p1, p2);
        frag.append(a);
    });

    return frag;
}

//9
function populateSelectMenu(users) {
    if (!users) return;
    const menu = document.getElementById("selectMenu");
    const arr = createSelectOptions(users);

    arr.forEach((a) => {
        menu.append(a);
    });

    return menu;
}

//10
async function getUsers() {
    try {
        const r = await fetch("https://jsonplaceholder.typicode.com/users");
        const users = await r.json();

        return users;
    } catch (err) {
        console.error(err);
    }
}

//11
async function getUserPosts(userId) {
    if (!userId) return;
    try {
        const r = await fetch(
            "https://jsonplaceholder.typicode.com/posts?userId=" + userId
        );
        const posts = await r.json();

        return posts;
    } catch (err) {
        console.error(err);
    }
}

//12
async function getUser(userId) {
    if (!userId) return;
    try {
        const r = await fetch(
            "https://jsonplaceholder.typicode.com/users/" + userId
        );
        const user = await r.json();

        return user;
    } catch (err) {
        console.error(err);
    }
}

//13
async function getPostComments(postId) {
    if (!postId) return;
    try {
        const r = await fetch(
            `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
        );
        const posts = await r.json();

        return posts;
    } catch (err) {
        console.error(err);
    }
}

//14
async function displayComments(postId) {
    if (!postId) return;
    const section = document.createElement("section");
    section.dataset.postId = postId;
    section.classList.add("comments", "hide");

    const comments = await getPostComments(postId);

    const frag = createComments(comments);
    section.append(frag);
    return section;
}

//15
async function createPosts(posts) {
    if (!posts) return;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < posts.length; i++) {
        const a = document.createElement("article");
        const post = posts[i];
        const h2 = createElemWithText("h2", post.title);
        const p1 = createElemWithText("p", post.body);
        const p2 = createElemWithText("p", `Post ID: ${post.id}`);
        const author = await getUser(post.userId);
        const p3 = createElemWithText(
            "p",
            `Author: ${author.name} with ${author.company.name}`
        );
        const p4 = createElemWithText("P", author.company.catchPhrase);

        const button = createElemWithText("button", "Show Comments");
        button.dataset.postId = post.id;

        a.append(h2, p1, p2, p3, p4, button);

        const section = await displayComments(post.id);
        a.append(section);
        frag.append(a);
    }

    return frag;
}

//16
async function displayPosts(posts) {
    const main = document.querySelector("main");
    const element = posts?.length
        ? await createPosts(posts)
        : createElemWithText(
              "p",
              "Select an Employee to display their posts.",
              "default-text"
          );

    main.append(element);

    console.log(element);
    return element;
}
//17
function toggleComments(event, postId) {
    if (!event || !postId) return;
    event.target.listener = true;
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);

    return [section, button];
}

//18
async function refreshPosts(posts) {
    if (!posts) return;
    const buttons = removeButtonListeners();
    const main = deleteChildElements(document.querySelector("main"));
    const post = await displayPosts(posts);
    const listen = addButtonListeners(posts);

    return [buttons, main, post, listen];
}

//19
async function selectMenuChangeEventHandler(event) {
    if (!event) return;
    const menu = document.querySelector("#selectMenu");
    menu.disabled = true;

    const userId = event?.target?.value || 1;

    const posts = await getUserPosts(userId);
    const refresh = await refreshPosts(posts);

    menu.disabled = false;

    const ans = [userId, posts, refresh];

    return ans;
}

//20
async function initPage() {
    const users = await getUsers();
    const menu = await populateSelectMenu(users);

    return [users, menu];
}

//21
function initApp() {
    initPage();
    const menu = document.querySelector("#selectMenu");
    menu.addEventListener("change", selectMenuChangeEventHandler, false);
}

document.addEventListener("DOMContentLoaded", initApp(), false);
