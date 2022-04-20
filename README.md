# DSW Poll Application

This was the final homework I did in DSW. 

Quick explanation of how it works/what is going on. 

The frontend gathers the poll data from the user, validates it using a validate function and then it sends it to a PHP script. The PHP Script is called the insertPollData.php and it inserts the data it received in the HTTP POST body into the database. The Vue Function “submit()” takes care of it (Line 149)

Upon receiving a success 200 status code in the HTTP request, we load the poll data to display it (Line 199). Once the Vue Variable “pollResultData” has a value and is not null, the page is displaying the results instead of the poll form. 

The loadPollData function loads the poll data from the database through a HTTP POST Request. Why POST? Because in order to calculate values that makes sense for a statistic (20% said X, 30% said Y) in the backend, we need to understand what kind of data we are looking at, so is the data a slider, a single choice or from a dropdown? That is why we compose aa template and send it over to the backend for it to understand the data, calculate a statistic and send something useful back. 

This picture from postman should help understand what is going on. 

And of course, you can update the last poll data you have inserted. To do this, we save the data in the localStorage. Once we update, we take the data out of the localStorage and put it in our forms so the user can change is with ease. The updating happens on a separate PHP script file (updatePollData.php)
