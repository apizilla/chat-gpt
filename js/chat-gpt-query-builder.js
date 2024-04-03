let search = request.params.search !== undefined && request.params.search !== null ? request.params.search : null;
let processed = request.params.processed;

let params = {
    limit: request.params.limit,
    page: request.params.page,
}
let where = [];

if (search !== null && search.length > 0) {
    params.query = '%' + search + "%";
    where.push("(query LIKE :query or content LIKE :query)")
}

if (processed === 'processed') {
    where.push("executed_at is not null")
} else if (processed === 'pending') {
    where.push("executed_at is null")
}

if(where.length === 0) {
    where.push("1=1");
}

let sqlQuery = "SELECT * FROM chat_gpt where " + where.join(" AND ") + " limit :offset, :limit"
let queryCount = "SELECT count(*) as c FROM chat_gpt where " + where.join(" AND ");

setParams(params)
setQuery(sqlQuery)
setCountQuery(queryCount)