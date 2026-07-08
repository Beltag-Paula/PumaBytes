require("dotenv").config();

const selectRepos = (strategy) => repos => strategy(repos);

const first5LiveThenRecent = (repos) => {
    const filtered = repos.filter(repo => repo.name !== "PumaBytes");

    const liveRepos = filtered.filter(
        repo => repo.live_code_url && repo.live_code_url.trim() !== ""
    );

    const recentRepos = [...filtered].sort(
        (a, b) => new Date(b.update) - new Date(a.update)
    );

    const selected = [...liveRepos.slice(0, 5)];

    for (const repo of recentRepos) {
        if (selected.length >= 5) break;

        if (!selected.some(r => r.repo_url === repo.repo_url)) {
            selected.push(repo);
        }
    }

    return selected;
};

async function getFeaturedRepos() {

    const response = await fetch(
        `https://api.github.com/users/${process.env.GITHUB_USERNAME}/repos`
    );

    const repos = (await response.json()).map(repo => ({
        name: repo.name,
        description: repo.description,
        live_code_url: repo.homepage,
        repo_url: repo.html_url,
        date: repo.created_at,
        update: repo.updated_at,
    }));

    return selectRepos(first5LiveThenRecent)(repos);
}

module.exports = { getFeaturedRepos };