require("dotenv").config();

const USERNAME = process.env.GITHUB_USERNAME;

const selectRepos = strategy => repos => strategy(repos);

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

        const response = await fetch(
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

async function getFeaturedRepos() {

    const response = await fetch(
        `https://api.github.com/users/${USERNAME}/repos`
    );

    const repos = (await response.json()).map(repo => ({
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

module.exports = {
    getFeaturedRepos
};