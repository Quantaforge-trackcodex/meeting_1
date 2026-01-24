export interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    private: boolean;
    html_url: string;
    description: string | null;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    updated_at: string;
    owner: {
        login: string;
        avatar_url: string;
    };
}

export const githubService = {
    async verifyToken(token: string): Promise<any> {
        const res = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `token ${token}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });
        if (!res.ok) throw new Error('Invalid Token');
        return res.json();
    },

    async getRepos(token: string): Promise<GitHubRepo[]> {
        const res = await fetch('https://api.github.com/user/repos?sort=updated&per_page=20', {
            headers: {
                Authorization: `token ${token}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });
        if (!res.ok) throw new Error('Failed to fetch repositories');
        return res.json();
    }
};
