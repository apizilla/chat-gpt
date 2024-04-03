let output = {}
let isSync = request.params.sync === true;
let hasId = request.params.id !== null && hasPermission("admin");
let query = request.params.query !== undefined && request.params.query !== null ? request.params.query : ""
let prompt = "What is: "

console.log(JSON.stringify({
    request: request,
    user: user,
    config: config,
    params: request.params
}))

try {
    let sqlUpdateParams = {}
    let sqlInsertParams = {
        queryContent: query,
        publicId: uuid()
    };

    let insertResult = run("chat-gpt-insert", sqlInsertParams)
    sqlUpdateParams.id = insertResult.Data.id;

    output.id = insertResult.Data.id;
    output.publicId = insertResult.Data.public_id;
    output.query = insertResult.Data.query;

    if (isSync) {

        let result = null;
        if (!config.mockOpenAiResponse) {
            result = run("chat-gpt-call-http", {
                "query": query,
                "prompt": prompt,
            })
            console.log(JSON.stringify(result))
        } else {
            result = {
                StatusCode: 200,
                BodyJson: {
                    usage: {
                        total_tokens: 10
                    },
                    choices: [
                        {
                            "message": {
                                "content": "mocked response"
                            }
                        }
                    ]
                }
            }
        }

        if (result.StatusCode !== 200) {
            setStatusCode(result.StatusCode)
            throw {
                "msg": "Invalid status code from chat gpt",
                "response": result.BodyJson
            }
        }

        output.httpResult = result.BodyJson

        let now = new Date();
        let month = (now.getMonth())+1;
        let day = now.getDate();
        let hour = now.getHours();
        let minute = now.getMinutes();
        let second = now.getSeconds();
        if (day < 10) {
            day = '0' + day;
        }

        if (month < 10) {
            month = `0${month}`;
        }

        sqlUpdateParams.content = result.BodyJson.choices[0].message.content
        sqlUpdateParams.executedAt = `${now.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}`
        sqlUpdateParams.tokens = result.BodyJson.usage.total_tokens

        let updateResult = run("chat-gpt-update", sqlUpdateParams)

        output.updateResults = updateResult;
        output.content = sqlUpdateParams.content;
        output.executedAt = sqlUpdateParams.executedAt;
        output.tokens = sqlUpdateParams.tokens;
    }

    output.ok = true;
    setResult(output)

} catch (e) {
    console.log("ERROR", JSON.stringify(e))
    throw e
}