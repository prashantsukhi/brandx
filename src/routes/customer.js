const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const customerController = require('../controllers/customerController');

router.get('/', (req, res) => {
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
});
router.post('/add',[  
        check('name').isLength({ min: 5 }).withMessage('name must be at least 5 chars long'),
        check('email', 'Email length should be 10 to 30 characters').isEmail(),
        check('mobile_no').matches(/\d/).withMessage('mobile no must contain a number').isLength({ min: 10 }).withMessage('mobile no must be at least 10 digits long'),
        check('address').isLength({ min: 5 }).withMessage('address must be at least 5 chars long'),
        check('locker_code').isLength({ min: 8 , max: 8}).withMessage('code must be 8 chars long'),
        //check('profile_img').notEmpty().withMessage('You must select an image')
    ],
    (req, res) => {
        var data = req.body;
        console.log(data);
        console.log(req.file)

        // validations
        const errors = validationResult(req);

        // validation for file
        if (!req.file) {
            return res.json({ errors: [{msg:'You must select an image'}] });
        } else {
            data.profile_img = req.file.filename;
        }

        if (!errors.isEmpty()) {
            return res.json({ errors: errors.array() });
        }

        req.getConnection((err, connection) => {
            
            var isCodeRedeemedQuery = "SELECT id, COUNT(status) AS total FROM code WHERE code = '"+ data.locker_code + "' AND STATUS = 0";
            const codeReeemQuery = connection.query(isCodeRedeemedQuery, (err, code) => {

                const codeId = code[0].id;

                if (code[0].total === 0) {
                    return res.json({ errors: [{msg:'either coupon is not valid or its alredy redeemed!'}] });  
                } else {
                        const insertQuery = connection.query('INSERT INTO customer set ?', data, (err, customer) => {
                        
                        if(err)
                        {
                            var errors_detail  = ("Error Insert : %s ",err );   
                            return res.json({ errors: [{msg:'Something went wrong'}] });
                            
                        } else {

                            const updateCodeSql = connection.query("UPDATE code set status = 1 WHERE id = ?", codeId, (err, rows) => {
                                
                                if(err)
                                {
                                    return res.json({ errors: [{msg:'Something went wrong'}] });   
                                    return res.json({ errors: [{msg:errors_detail}] });
                                    
                                } else {

                                    return res.json({ success: [{msg:'coupon is redeemed successfully!'}] });

                                }
                            });
                        }
                    })
                }            
            }); 
            
            
        })
});
module.exports = router;
