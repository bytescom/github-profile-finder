const main_URL = "https://api.github.com/users/";
const profileResult = document.querySelector(".profile-result");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

getUser("bytescom");

// Fetch user data
async function getUser(username) {
    try {
        const response = await fetch(main_URL + username);
        const respData = await response.json();

        if (respData.message === "Not Found") {
            alert("User not found. Please enter a valid GitHub username.");
            return;
        }

        createUserCard(respData);
        getRepos(username);
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}

// Fetch user repositories
async function getRepos(username) {
    try {
        const resp = await fetch(main_URL + username + "/repos");
        const respData = await resp.json();
        addReposToCard(respData);
    } catch (error) {
        console.error("Error fetching repositories:", error);
    }
}

// Display user card
function createUserCard(user) {
    const cardHTML = `
        <div class="profile-left">
            <img class="img" src="${user.avatar_url}" alt="${user.name}" />
            <button class="view-profile">
                <a target="_blank" href="${user.html_url}">View Profile</a>
            </button>
        </div>
        <div class="profile-right">
            <p class="name">${user.name || "No Name"}</p>
            <p class="bio">${user.bio || "No bio available."}</p>

            <ul class="follow">
                <li>${user.followers} <strong>Followers</strong></li>
                <li>${user.following} <strong>Following</strong></li>
                <li>${user.public_repos} <strong>Repositories</strong></li>
            </ul>

            <div class="repos"></div>
        </div>
    `;

    profileResult.innerHTML = cardHTML;
}

// Display repositories
function addReposToCard(repos) {
    const reposEl = document.querySelector(".repos");
    reposEl.innerHTML = "";

    repos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 10) // Show only top 10 repos
        .forEach((repo) => {
            const repoEl = document.createElement("a");
            repoEl.classList.add("repo");
            repoEl.href = repo.html_url;
            repoEl.target = "_blank";
            repoEl.innerText = repo.name;
            reposEl.appendChild(repoEl);
        });
}

// Search button click event
searchBtn.addEventListener("click", () => {
    const user = searchInput.value.trim();
    if (user) {
        getUser(user);
    } else {
        alert("Please enter a GitHub username.");
    }
});

// Enter key event for search input
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const user = searchInput.value.trim();
        if (user) {
            getUser(user);
        } else {
            alert("Please enter a GitHub username.");
        }
    }
});