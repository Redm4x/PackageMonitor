exports.handler = (event, context, callback) => {
    const latestVersion = require('latest-version');
    const { Map, fromJS } = require('immutable');
    
    const data = JSON.parse(event.body);
    const packages = fromJS(data);
    
    let versions = Map({});
    let promises = [];
    
    packages.forEach((val,key) => {
        const prom = latestVersion(key).then(version => {
            versions = versions.set(key, version);
        });
        
        promises.push(prom);
    });
    
    Promise.all(promises).then(() => {
        let response = versions.toJSON();
        
        callback(null, {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(response)
        });
    });
};