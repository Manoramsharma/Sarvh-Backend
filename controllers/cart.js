const Cart = require("../models/cart")

exports.addItemToCart = (req ,res) => {
    Cart.findOne({ user: req.user._id})
    .exec((error , cart) => {
        if(error) return res.status(400).json({error});
        if(cart){
            const product = req.body.cartItems.product ;
            const item = cart.cartItems.find( c => c.product == product);

            if(item){

                Cart.findOneAndUpdate({ "user": req.user._id , "cartItems.product" : product } , {
                    "$set": {
                        "cartItems.$" : {
                            ...req.body.cartItems,
                        quantity : item.quantity + req.body.cartItems.quantity   }
                    }
                })
              .exec((error , _cart) =>{
                    if(error) return res.status(400).json({error});
                    if(_cart){
                        return res.status(200).json({cart : _cart});
                    }
                }) 
            }else{

                Cart.findOneAndUpdate({ user: req.user._id} , {
                    "$push": {
                        "cartItems" : req.body.cartItems
                    }
                })
                .exec((error , _cart) =>{
                    if(error) return res.status(400).json({error});
                    if(_cart){
                        return res.status(200).json({cart : _cart});
                    }
                });
            }
            /* return res.status(400).json({message : 'hello same user'});  */
          /*  will now update the cart as cart should be unique for a user */
        }else{

            const cart = new Cart({
                user : req.user._id ,
                cartItems : [req.body.cartItems]
            })
        
           cart.save((err , cart) =>{
               if(error) return res.status(400).json({error});
               if(cart){
                   return res.status(200).json({cart});
               }
           });
        }
        
    })

};
