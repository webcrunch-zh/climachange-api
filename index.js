const PORT = 8000
const express = require('express')
const axios = require('axios');
const cheerio = require('cheerio');
const mysql = require('mysql');
const { response } = require('express');
const app = express();



const connection = mysql.createPool({
        connectionLimit: 5,
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'crawl_jobs'
});







app.get ('/', (req,res) => {
        res.json("Welcome to the my rest api")
})

app.get ('/job/:id*', (req,res) => {
        
        const id = req.params['id']
        axios.get('https://www.jobs.ch/api/v1/public/search/job/' + id ).then ( (response) => {
                
                const json = response.data
                res.json(json)
        }).catch ( (err) =>
                res.json(err) 
        )
})


app.get ('/company/:id*', (req,res) => {
        
        const id = req.params['id']
        axios.get('https://www.jobs.ch/api/v1/public/company/' + id ).then ( (response) => {
                
                const json = response.data
                res.json(json)
        }).catch ( (err) =>
                res.json(err) 
        )
}) 
app.get ('/jobs/:pages*', (req,res) => {
        
       const page = req.params['pages']
        const results_per_page = 33;
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



app.listen(PORT, () => console.log('Job APII is up and running')) 