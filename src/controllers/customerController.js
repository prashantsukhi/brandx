const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM customer', (err, customers) => {
            if (err) {
                res.json(err);
            }
            res.render('customers', {
                data: customers
            });
        });
    });
};

controller.save = (req, res) => {
    const data = req.body;
    console.log('REQUEST BODY -----' , req.body);

    //validations
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.json(errors)
    }

    req.getConnection((err, connection) => {
        
        var isCodeRedeemedQuery = "SELECT id, COUNT(status) AS total FROM code WHERE code = '"+ data.locker_code + "' AND STATUS = 0";
        const codeReeemQuery = connection.query(isCodeRedeemedQuery, (err, code) => {

            const codeId = code[0].id;

            if (code[0].total === 0) {
                console.log('!!!!!COUPON ALREDY REDEEMED!!!!');
                var errors_detail  = ('!!!!!COUPON ALREDY REDEEMED!!!!');   
                res.render('customers', {
                    data: errors_detail
                });  
            } else {
                console.log('!!!!!COUPON IS READY TO REDEEM!!!!');
                    const insertQuery = connection.query('INSERT INTO customer set ?', data, (err, customer) => {
                    
                    if(err)
                    {
                        var errors_detail  = ("Error Insert : %s ",err );   
                        res.render('customers', {
                            data: errors_detail
                        });
                        
                    } else {

                        const updateCodeSql = connection.query("UPDATE code set status = 1 WHERE id = ?", codeId, (err, rows) => {
                            
                            if(err)
                            {
                                var errors_detail  = ("Error Insert : %s ",err );   
                                res.render('customers', {
                                    data: errors_detail
                                });
                                
                            } else {

                                var errors_detail  = ('!!!!! COUPON REDEEMED SUCCESSFULLY !!!!');;   
                                res.render('customers', {
                                    data: errors_detail
                                });

                            }
                        });
                    }
                    // console.log(customer);
                    // res.redirect('/');
                })
            }            
        }); 
        
        
    })
};

controller.edit = (req, res) => {
    const {id} = req.params;
    req.getConnection((err, conn) => {
        conn.query("SELECT * FROM customer WHERE id = ?", [id], (err, rows) => {
            res.render('customers_edit', {
                data: rows[0]
            })
        });
    });
};

controller.update = (req, res) => {
    const {id} = req.params;
    const newCustomer = req.body;
    req.getConnection((err, conn) => {

        conn.query('UPDATE customer set ? where id = ?', [newCustomer, id], (err, rows) => {
            res.redirect('/');
        });
    });
};

controller.delete = (req, res) => {
    const {id} = req.params;
    req.getConnection((err, connection) => {
        connection.query('DELETE FROM customer WHERE id = ?', [id], (err, rows) => {
            res.redirect('/');
        });
    });
};

module.exports = controller;
