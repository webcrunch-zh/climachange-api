const PORT = 5000
const express = require('express')
const mysql = require('mysql');
const { response } = require('express');
const app = express();



const connection = mysql.createPool({
        connectionLimit: 5,
    host: 'webcrunch-jobs.cic82xyjeh20.us-east-1.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password: '15261712',
    database: 'crawler'
});







app.get ('/', (req,res) => {
        res.json("Welcome to the my rest api")
})

app.get ('/job/:id*', (req,res) => {
        
        const id = req.params['id']


        

        connection.getConnection(function(err, connection) {

                        connection.query("SELECT * FROM jobs_ch WHERE job_id LIKE " + id + "  " , function (err, result, fields) {
                                
                                res.json(result)

                        });
                        connection.release()
                       
                });


        

        
})


app.get ('/company/:id*', (req,res) => {
        
        const id = req.params['id']
        
        connection.getConnection(function(err, connection) {

                        connection.query("SELECT * FROM companys_ch WHERE company_id LIKE " + id + "  " , function (err, result, fields) {
                                
                                res.json(result)

                        });
                        connection.release()
                       
                });
}) 



app.get ('/jobs/:output*/:pages*', (req,res) => {
        
        let page = req.params['pages']


        


        const output = req.params['output']

        const results_per_page = output;
        const page_first_result = page * results_per_page;  

        

        // Get total number of pages
        const query = "SELECT * FROM jobs_ch";  
        const result = connection.query(connection, query);  
        

                connection.getConnection(function(err, connection) {

                        connection.query("SELECT * FROM jobs_ch", function (err, result, fields) {
                                const number_of_result = result.length;
                                const number_of_page = Math.ceil(number_of_result / results_per_page) - 1; 
                                console.log(number_of_page) 

                        });
                        connection.release()
                       
                });
                
        const final_query = "SELECT * FROM jobs_ch LIMIT " + page_first_result + ", " + results_per_page ;    






        connection.getConnection(function(err, connection) {

                        connection.query(final_query, function (err, result, fields) {
                                if (result.length > 0) {
                                        console.log(result)
                                        res.json(result)
                                } else {
                                        res.json('Out of Range')
                                }

                        });
                        connection.release()
                       
                });
                
        
        
        
})


app.get ('/random/:limit*', (req,res) => {

        

        const limit = req.params['limit']
        
        connection.getConnection(function(err, connection) {

                        connection.query("SELECT * FROM jobs_ch ORDER BY RAND() LIMIT " + limit , function (err, result, fields) {
                                
                                res.json(result)

                        });
                        connection.release()
                       
                });

      
})



app.get ('/search/:phrase*', (req,res) => {

        

        const phrase = req.params['phrase']
        
        connection.getConnection(function(err, connection) {

                        connection.query("SELECT * FROM jobs_ch  WHERE title LIKE '%" + phrase +"%' "         , function (err, result, fields) {
                                
                                console.log(phrase)
                                res.json(result)

                        });
                        connection.release()
                       
                });

      
})



app.get ('/jobs/total', (req,res) => {
        

        const query = "SELECT * FROM jobs_ch";
        
        connection.getConnection(function(err, connection) {

                        connection.query(query , function (err, result, fields) {
                                
                                res.json(result.length)

                        });
                        connection.release()
                       
                });
}) 

app.listen(process.env.PORT || 5000, () => console.log('Job APII is up and running')) 