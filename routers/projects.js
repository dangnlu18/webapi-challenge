const express = require('express')
const proj = require('../data/helpers/projectModel')
const actionRouter = require('./actions')
const router = express.Router()

router.use('/:id/actions', actionRouter)

router.get('/', (req,res)=>{
    proj.get()
        .then(data => res.json(data))
        .catch()
})

router.get('/:id', validateProjectExist(), (req,res)=>{
    res.json(req.project)
})

router.get('/:id/actions', validateProjectExist(), (req, res)=>{
    proj.getProjectActions(req.params.id)
        .then(data => res.json(data))
        .catch(err => res.status(400).json({message: 'could not find actions with this project ID'}))
})

router.post('/', validateProject(), (req, res)=>{
    proj.insert(req.payload)
        .then(data => res.json(data))
        .catch(err => res.status(500).json({error: 'Project cannot be made'}))
})

router.put('/:id', validateProjectExist(), validateProject(), (req, res)=>{
    proj.update(req.params.id, req.payload)
        .then(data => res.json(data))
        .catch(err => res.status(500).json({error: 'Project cannot be updated'}))
})

router.delete('/:id', validateProjectExist(), (req, res)=>{
    proj.remove(req.params.id)
        .then(data => res.status(200).json({message: 'Project has been deleted'}))
        .catch(err => res.status(404).json({message: 'could not delete project'}))
})


//middleware

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


function validateProject(){
    return (req, res, next)=>{
        payload={
            name: req.body.name,
            description: req.body.description
        }

        if(!req.body.name || !req.body.description){
            return res.status(404).json({message: 'missing name or description'})
        }else{
            req.payload = payload
            next()
        }
    }
}

module.exports = router