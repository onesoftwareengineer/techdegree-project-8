'strict mode'
const Sequelize = require('sequelize');

module.exports = () => {
    class Book extends Sequelize.Model {};
    
    Book.init({
        title: {
            type: Sequelize.STRING,
            validate: {
                notNull: {
                    msg: "Add book title"
                },
                notEmpty: {
                    msg: "Add book title"
                }
            }
        },
        author: {
            type: Sequelize.STRING,
            validate: {
                notNull: {
                    msg: "Add book author"
                },
                notEmpty: {
                    msg: "Add book author"
                }
            }
        },
        genre: Sequelize.STRING,
        year: Sequelize.INTEGER
    });

    return Book;
};