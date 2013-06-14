var is = require('annois');
var utils = require('./utils');


module.exports = parse;

function parse(env, template, config) {
    return parseEnv(env, template, config);
}

function parseEnv(env, template, config, parent, prefix) {
    var k, v, envVar;

    if(!parent) parent = {};

    for(k in template) {
        v = template[k];

        envVar = prefix? prefix + '_': '';
        envVar += utils.toEnvVar(k);

        if(is.object(v)) {
            parent[k] = {};
            parseEnv(env, v, v, parent[k], envVar);
        }
        else {
            if(envVar in env) {
                parent[k] = env[envVar];
            }
            else if(k in config) {
                parent[k] = config[k];
            }
            else {
                parent[k] = undefined;

                console.warn('Failed to find value for ' + envVar);
            }
        }
    }

    return parent;
}