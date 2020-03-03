/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    login: async function (req, res) {

        if (req.method == "GET") return res.view('user/login');
    
        if (!req.body.username || !req.body.password) return res.badRequest();
    
        var user = await User.findOne({ username: req.body.username });
    
        if (!user) return res.status(401).send("User not found");
        
        const match = await sails.bcrypt.compare(req.body.password, user.password);

        if (!match) return res.status(401).send("Wrong Password");
    
        req.session.regenerate(function (err) {
    
            if (err) return res.serverError(err);
    
            req.session.username = req.body.username;
            req.session.uid = user.id;
            req.session.role = user.role;


            sails.log("Session is ", JSON.stringify(req.session));
            sails.log("[Session] ", req.session);

            if (req.wantsJSON) {
                return res.redirect('/user/homepage');
            }
            
            //return res.ok("Login successfully.");
    
        });
    
    },

    logout: async function (req, res) {

        req.session.destroy(function (err) {
        
            if (err) return res.serverError(err);
            
            return res.redirect('/user/homepage')
            //return res.ok("Log out successfully.");

            
        });
    },

    // action - homepage
    homepage: async function (req, res) {

        return res.view('user/homepage');

    },
    

};

