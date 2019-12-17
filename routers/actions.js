const express = require('express')
const proj = require('../data/helpers/projectModel')
const action = require('../data/helpers/actionModel')
const router = express.Router({
    mergeParams: true
})

router.get('/:actionId', validateProjectExist(), validateActionExist(), (req,res)=>{
    res.json(req.action)
})

router.post('/', validateProjectExist(), validateActionPost(), (req,res)=>{
    action.insert(req.payload)
        .then(data => res.json(data))
        .catch(err => res.status(500).json({error: 'Action cannot be made'}))
})

router.put('/:actionId', validateProjectExist(), validateActionExist(), validateActionPost(), (req,res)=>{
    action.update(req.params.actionId, req.payload)
        .then(data => res.json(data))
        .catch(err => res.status(500).json({error: 'Action cannot be updated'})) 
})


router.delete('/:actionId', validateProjectExist(), validateActionExist(), (req,res)=>{
    action.remove(req.params.actionId)
        .then(data => res.status(200).json({message: 'Action has been deleted'}))
        .catch(err => res.status(404).json({message: 'could not delete action'}))
})


function validateProjectExist(){
    return (req, res, next)=>{
        proj.get(req.params.id)
            .then(project =>{
                if(project){
                    req.project = project
                    next()
                } else{
                    res.status(400).json({message: 'could not find project with provided ID'})
                }
            })
            .catch(err => res.status(500).json({message:'error getting project with provided ID' }))
    }
}


function validateActionExist(){
    return (req, res, next)=>{
        action.get(req.params.actionId)
            .then(act =>{
                if(!act){
                    res.status(400).json({message: 'could not find action'})
                }else{
                    req.action = act
                    next()
                }
            })
    }
}


function validateActionPost(){
    return (req, res, next)=>{
        payload={
            project_id: req.params.id,
            description: req.body.description,
            notes: req.body.notes
        }

        if(!req.body.notes || !req.body.description){
            return res.status(404).json({message: 'missing notes or description'})
        }else{
            req.payload = payload
            next()
        }
    }
}
module.exports = router