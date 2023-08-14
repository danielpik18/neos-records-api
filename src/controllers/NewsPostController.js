import NewsPostModel from "../models/NewsPostModel.js";

// Get All Items
export const getAllNews = async (req, res) => {
    const getPagination = (size, page) => {
        const limit = size ? +size : 3;
        const offset = page ? page * limit : 0;
    
        return {limit, offset}
    }

    const getPaginatedData = (data, page, limit) => {
        const {count: totalItems, rows: news} = data;
        const currentPage = page ? +page : 0;
        const totalPages = Math.ceil(totalItems / limit)

        return {totalItems, news, currentPage, totalPages}
    }

    try {
        // Get params from the query
        const {size, page} = req.query;

        // Get limit and offset
        const {limit, offset} = getPagination(size, page);

        const news = await NewsPostModel.findAndCountAll({
            limit,
            offset
        });

        
        return res.json(getPaginatedData(news, page, limit));
    } catch (error) {
        return res.json({
            message: error.message
        })
    }
};

// Get specific item
export const getNewsItem = async (req, res) => {
    try {
        const newsItem = await NewsPostModel.findAll({
            where: {
                id: req.params.id
            }
        });

        return res.status(200).json(newsItem[0]);
    } catch (error) {
        return res.json({
            message: error.message
        })
    }
};

// Create item

export const createNewsItem = async (req, res) => {
    try {
        const createdNewsItem = await NewsPostModel.create(req.body)
        return res.json({
            message: 'News Item added correctly!',
            itemCreated: createdNewsItem
        })
    } catch (error) {
        return res.json({
            message: error.message
        })
    }
}

// Update item
export const updateNewsItem = async (req, res) => {
    try {
        const affectedRows = await NewsPostModel.update(req.body, {
            where: {
                id: req.params.id
            }
        });

        if(affectedRows[0] >= 1) {
            return res.json({
                message: 'News Item updated correctly!'
            })
        } else {
            return res.json({
                message: 'Record not found or nothing was changed.'
            })
        }

        
    } catch (error) {
        return res.json({
            message: error.message
        })
    }
}

// Delete item
export const deleteNewsItem = async (req, res) => {
    try {
        await NewsPostModel.destroy({
            where: {
                id: req.params.id
            }
        });

        return res.json({
            message: 'News Item deleted correctly!'
        })
        
    } catch (error) {
        return res.json({
            message: error.message
        })
    }
}