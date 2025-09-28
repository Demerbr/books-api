const db = require('../database/db');

const BOOKS_TABLE = 'books';
const BOOK_FIELDS = `
    *
`;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 5;
const DEFAULT_SEARCH_LIMIT = 20;
const DEFAULT_SORT_BY = 'createdAt';
const DEFAULT_SORT_ORDER = 'DESC';

const ALLOWED_SORT_FIELDS = {
    'name': 'name',
    'title': 'name',
    'date': 'publishedAt',
    'publishedAt': 'publishedAt',
    'createdAt': 'createdAt',
    'price': 'price'
};

const ALLOWED_SORT_ORDERS = ['ASC', 'DESC'];
const buildOrderBy = (sortBy = DEFAULT_SORT_BY, sortOrder = DEFAULT_SORT_ORDER) => {
    const field = ALLOWED_SORT_FIELDS[sortBy] || DEFAULT_SORT_BY;
    const order = ALLOWED_SORT_ORDERS.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : DEFAULT_SORT_ORDER;
    return `ORDER BY ${field} ${order}`;
};

const findAll = async (page = DEFAULT_PAGE, limit = DEFAULT_LIMIT, sortBy = DEFAULT_SORT_BY, sortOrder = DEFAULT_SORT_ORDER) => {
    const orderByClause = buildOrderBy(sortBy, sortOrder);
    const selectQuery = `
        SELECT
            ${BOOK_FIELDS}
        FROM
            ${BOOKS_TABLE}
        ${orderByClause}
        OFFSET
            $1
        LIMIT
            $2
    `
    const countQuery = `
    SELECT
        count(*)
    FROM
        ${BOOKS_TABLE}
    `
    const offset = (page - 1) * limit;
    const [result, countTotal] = await Promise.all([
        db.query(selectQuery, [offset, limit]),
        db.query(countQuery)
    ]);
    const hasMore = (result.rowCount + offset) < countTotal.rows[0].count
    return {
        data: result.rows,
        hasMore,
        page,
        limit
    };
}

const searchByText = async (text, page = DEFAULT_PAGE, limit = DEFAULT_SEARCH_LIMIT, sortBy = DEFAULT_SORT_BY, sortOrder = DEFAULT_SORT_ORDER) => {
    const orderByClause = buildOrderBy(sortBy, sortOrder);
    const selectQuery = `
        SELECT
            ${BOOK_FIELDS}
        FROM
            ${BOOKS_TABLE}
        WHERE
            searchable ILIKE $1
        ${orderByClause}
        OFFSET
            $2
        LIMIT
            $3
    `
    const countQuery = `
        SELECT
            count(*)
        FROM
            ${BOOKS_TABLE}
        WHERE
            searchable ILIKE $1
    `
    const offset = (page - 1) * limit;
    const [result, countTotal] = await Promise.all([
        db.query(selectQuery, [`%${text}%`, offset, limit]),
        db.query(countQuery, [`%${text}%`])
    ]);
    const hasMore = (result.rowCount + offset) < countTotal.rows[0].count
    return {
        data: result.rows,
        hasMore,
        page,
        limit
    };
}


const findById = async (id) => {
    const selectQuery = `
        SELECT
            ${BOOK_FIELDS}
        FROM
            ${BOOKS_TABLE}
        WHERE
            id = $1
    `;
    const result = await db.query(selectQuery, [id]);
    return { data: result.rows[0] };
}

module.exports = {
    findAll,
    searchByText,
    findById
}