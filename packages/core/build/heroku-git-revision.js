// Mock Git Revision Plugin for Heroku
class MockGitRevisionPlugin {
    constructor(options = {}) {
        this.options = options;
    }

    version() {
        return 'heroku-deploy';
    }

    commithash() {
        return 'heroku-deploy';
    }

    branch() {
        return 'master';
    }
}

module.exports = {
    GitRevisionPlugin: MockGitRevisionPlugin
}; 