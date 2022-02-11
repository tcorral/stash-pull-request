import chalk from 'chalk';
import { execSync } from 'child_process';

export default () => {
    const neededEnvVariables = [
        'STASH_USERNAME',
        'STASH_PASSWORD',
        'STASH_PROTOCOL',
        'STASH_HOST',
        'STASH_PROJECT',
        'STASH_REPOSITORY',
        'PR_TITLE',
        'PR_DESCRIPTION',
        'PR_BRANCH_NAME',
        'PR_TARGET_BRANCH',
    ];
    
    const logErrorOnEmptyEnvVariable = (envVariableName: string) => {
        const isEnvVariableSet = (envVariableName in process.env);
        if (!isEnvVariableSet) {
            console.log(chalk.red(`${envVariableName} is not set`));
        }
        return isEnvVariableSet;
    };
    
    const allEnvVariablesSet = neededEnvVariables.every(logErrorOnEmptyEnvVariable);
    
    if (!allEnvVariablesSet) {
        process.exit(1);
    }
    
    execSync(`curl -k -u ${process.env.STASH_USERNAME}:${process.env.STASH_PASSWORD} -X POST -H "Content-Type: application/json" -d '{"title":"${process.env.PR_TITLE}","description":"${process.env.PR_DESCRIPTION}","fromRef":{"id":"refs/heads/${process.env.PR_BRANCH_NAME}"},"toRef":{"id":"refs/heads/${process.env.PR_TARGET_BRANCH}"}}' ${process.env.STASH_PROTOCOL}://${process.env.STASH_HOST}/rest/api/1.0/projects/${process.env.STASH_PROJECT}/repos/${process.env.STASH_REPOSITORY}/pull-requests`, {
        stdio: 'inherit',
        cwd: process.cwd(),
        encoding: 'utf8',
    });
};