require("dotenv").config();

const USERNAME = process.env.GITHUB_USERNAME;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const selectRepos = strategy => repos => strategy(repos);
const fs = require('fs/promises');
const path = require("path");

const githubProfilePath = path.join(__dirname, "../json", "githubProfile.json");
const featuredReposPath = path.join(__dirname, "../json", "featuredRepos.json");
const first5LiveThenRecent = repos => {

    const filtered = repos.filter(repo => repo.name !== "PumaBytes");

    const liveRepos = filtered.filter(
        repo => repo.live_code_url && repo.live_code_url.trim() !== ""
    );

    const recentRepos = [...filtered].sort(
        (a, b) => new Date(b.update) - new Date(a.update)
    );

    const selected = [...liveRepos.slice(0, 5)];

    for (const repo of recentRepos) {

        if (selected.length >= 6) break;

        if (!selected.some(r => r.repo_url === repo.repo_url)) {
            selected.push(repo);
        }

    }

    return selected;

};

async function getDemoImages(repoName) {

    try {

        const response = await authorizedFetch(
            `https://api.github.com/repos/${USERNAME}/${repoName}/contents/images_demo`
        );

        if (!response.ok) {
            return [];
        }

        const files = await response.json();

        return files
            .filter(file => file.type === "file")
            .sort((a, b) =>
                a.name.localeCompare(b.name, undefined, {
                    numeric: true,
                    sensitivity: "base"
                })
            )
            .map(file => ({
                name: file.name,
                url: file.download_url
            }));

    } catch (err) {

        console.error(`Failed loading images for ${repoName}`, err);

        return [];

    }

}

const authorizedFetch = (url) => fetch(
    url,
    {
        headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
        }
    }
);

async function getFeaturedRepos() {

    const response = await authorizedFetch(
        `https://api.github.com/users/${USERNAME}/repos`,
    );

    const repos = (await response.json()).map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        live_code_url: repo.homepage,
        repo_url: repo.html_url,
        date: repo.created_at,
        update: repo.updated_at
    }));

    const featured = selectRepos(first5LiveThenRecent)(repos);

    return await Promise.all(
        featured.map(async repo => ({
            ...repo,
            images: await getDemoImages(repo.name)
        }))
    );
}

async function fetchAndWriteGithubData() {
    try {
        const githubResponse = await authorizedFetch(
            `https://api.github.com/users/${process.env.GITHUB_USERNAME}`
        );

        const githubProfile = await githubResponse.json();
        try {
            await fs.writeFile(githubProfilePath, JSON.stringify(githubProfile));
            console.log('File written successfully');
        } catch (err) {
            console.error('Error writing file:', err);
        }
        const featuredRepos = await getFeaturedRepos();
        try {
            await fs.writeFile(featuredReposPath, JSON.stringify(featuredRepos));
            console.log('File written successfully');
        } catch (err) {
            console.error('Error writing file:', err);
        }
        return { featuredRepos, githubProfile };
        console.log("GitHub data refreshed.");
    } catch (err) {
        console.error("Failed to refresh GitHub data:", err);
    }
}


async function getGithubDataFromJsonFile() {
    try {

        const access = await fs.stat(githubProfilePath);
        if (access) {
            const githubProfile = await fs.readFile(githubProfilePath, { encoding: 'utf-8' });
            const featuredRepos = await fs.readFile(featuredReposPath, { encoding: 'utf-8' });

            return { featuredRepos: JSON.parse(featuredRepos), githubProfile: JSON.parse(githubProfile) };
        }
    } catch (ex) {
        console.error('Files not found, requesting them', ex)
    }

    return await fetchAndWriteGithubData();

}
module.exports = {
    getGithubDataFromJsonFile,
    fetchAndWriteGithubData
};