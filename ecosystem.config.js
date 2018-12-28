module.exports = {
    apps: [{
        name: 'Issue-tracker',
        script: 'src/index.ts',
        interpreter: './node_modules/.bin/ts-node',
        args: ['--no-daemon'],
        watch: [
            'src'
        ],
        ignore_watch: [
            "node_modules",
            "client",
            "tests"
        ],
        env: {
            NODE_ENV: 'development'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }],

    deploy: {
        production: {
            user: 'node',
            host: '212.83.163.1',
            ref: 'origin/master',
            repo: 'git@github.com:repo.git',
            path: '/var/www/production',
            'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
        }
    }
};
