const Cart = require("../models/cart");
const Users = require("../models/userModel");

exports.addItemToCart = (req, res) => {
  Cart.findOne({ user: req.user._id }).exec((error, cart) => {
    if (error) return res.status(400).json({ error });
    if (cart) {
      const product = req.body.cartItems.product;
      const item = cart.cartItems.find(c => c.product == product);

      if (item) {
        Cart.findOneAndUpdate(
          { user: req.user._id, "cartItems.product": product },
          {
            $set: {
              cartItems: {
                ...req.body.cartItems,
                quantity: item.quantity + req.body.cartItems.quantity,
              },
            },
          }
        ).exec((error, _cart) => {
          if (error) return res.status(400).json({ error });
          if (_cart) {
            return res.status(200).json({ cart: _cart });
          }
        });
      } else {
        Cart.findOneAndUpdate(
          { user: req.user._id },
          {
            $push: {
              cartItems: req.body.cartItems,
            },
          }
        ).exec((error, _cart) => {
          if (error) return res.status(400).json({ error });
          if (_cart) {
            return res.status(200).json({ cart: _cart });
          }
        });
      }
      /* return res.status(400).json({message : 'hello same user'});  */
      /*  will now update the cart as cart should be unique for a user */
    } else {
      const cart = new Cart({
        user: req.user._id,
        cartItems: [req.body.cartItems],
      });

      cart.save((err, cart) => {
        if (error) return res.status(400).json({ error });
        if (cart) {
          return res.status(200).json({ cart });
        }
      });
    }
  });
};
exports.addToCart = async (req, res) => {
  try {
    const findCart = await Users.find({
      _id: req.user._id,
      "cart.product": req.params.id,
    });
    if (findCart.length > 0) {
      //already in the cart
      // we can update quantity
      const data = await Users.update(
        {
          _id: req.user._id,
          "cart.product": req.params.id,
        },
        {
          $set: {
            "cart.$.quantity": req.params.quantity,
          },
        }
      ).populate("cart");
      return res.status(200).json({ msg: "cart updated successfull" });
    }

    const data = await Users.findOneAndUpdate(
      {
        _id: req.user._id,
      },
      {
        $push: {
          cart: {
            product: req.params.id,
            quantity: req.params.quantity,
          },
        },
      },
      { upsert: true, new: true }
    ).populate("cart");
    res.send(data);
  } catch (error) {
    console.log(error);
    res.send({ msg: error.message });
  }
};
