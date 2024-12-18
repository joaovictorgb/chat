import {Router} from 'express';
const router= Router();
router.get('/',(req,res) =>{
    res.render('index',{
        title: "Chat em tempo real",
        style: 'style.css'
    });
});
export default router;