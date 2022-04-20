
const questions = [
    {
        key:"gender",
        description:"Please state your gender",
        type: "dropdown",
        items: [
            "Male",
            "Female",
            "Diverse",
        ]
    },
    {
        key:"gameLastPurchase",
        description:"In which game have you made your last purchase?",
        type: "inputtext",
        inputLabel:"Enter the name of the game"
    },
    {
        key:"timeSpentlastTwoDays",
        description:"How much time have you spent in that game in the last 2 days?",
        type: "slider",
        steps: 10,
        options:{
            min:0,
            minLabel: "Not time at all",
            max:10,
            maxLabel: "Too much time"
        }
    },
    {
        key:"lootboxesBought",
        description:"How many loot boxes (keys included) have you bought, if any?",
        type: "slider",
        steps: 10,
        options:{
            min:0,
            minLabel: "No lootboxes",
            max:10,
            maxLabel: "Way too many"
        }
    },
    {
        key:"deviceType",
        description:"Do you play on a laptop or on a desktop?",
        type: "singlechoice",
        items: [
            {
                name:"Laptop",
                value: 1,
            },
            {
                name:"Desktop",
                value: 2,
            },
        ]
    },
    {
        key:"cpuUsage",
        description:"Intel or AMD?",
        type: "singlechoice",
        items: [
            {
                name:"Intel",
                value: 1,
            },
            {
                name:"AMD",
                value: 2,
            },
        ]
    },
]

const wsURLs = {
    corsProxy:"https://thingproxy.freeboard.io/fetch/",
    insertPollData: "http://cc211004.students.fhstp.ac.at/dsw/hw/backend/insertPollData.php/",
    fetchPollData: "http://cc211004.students.fhstp.ac.at/dsw/hw/backend/fetchPollDataTemplated.php",
    updatePollData: "http://cc211004.students.fhstp.ac.at/dsw/hw/backend/updatePollData.php"
}


// How? Make a request in your browser, check the network tab under Request Headers and get the Cookie property
const bypassCookie = "netlabs_roadblock=a1a1fec39ad74ed107673c8efd8a1010b8470261d1bd3df10201c8e05eb69958";


const xhrFetch = (url,options) => {
    
    return new Promise((reject,resolve) => {
        let xhrRequest = new XMLHttpRequest();
        xhrRequest.onreadystatechange = () => {
            if(xhrRequest.readyState == 4){      
                if(xhrRequest.status >= 400){       // error
                    resolve(xhrRequest.responseText)
                }
                else if(xhrRequest.status >= 200){  // success
                    reject(xhrRequest.responseText)
                }    
            }
        }
        
        xhrRequest.open(options.method || "GET", url); // default is get if method not explicitly declared

        Object.keys(options.headers).forEach(headerItem => {
            xhrRequest.setRequestHeader(headerItem,options.headers[headerItem]);
        })

        xhrRequest.send(options.body || new FormData())
    })
}


var app = Vue.createApp({
    data(){
        return {
            hasNotEnteredPoll:!Boolean(localStorage.getItem("hasNotEnteredPoll")),
            showPoll:false,
            showDialog:true,
            hasInsertedData:false,
            isUpdatingPoll:false,
            pollResultData:null,
            startCardText:"",
            startButtonDisabled:true,
            formsData:{
                questions:questions,
                models:{}
            },
            netlabCookie:"" 
        }
    },
    methods:{
        startPoll(){
            this.showPoll = true;
            this.showDialog = false;
        },
        restartPoll(){
            this.showPoll = true;
            this.showDialog = false;
            //localStorage.removeItem("userPoll")
        },
        showPollResult(){
            this.showDialog = false;
            this.loadPollData();
            this.showPoll = false;
        },
        validate(){
            return Object.values(this.formsData.models).every(model => model != null || undefined)
        },
        submit(){
            if(this.validate()){
                // send data to the WebService
                let formerPollData = localStorage.getItem("userPoll") // STRING 

                //console.log(formerPollData)

                if(this.isUpdatingPoll){        
                    this.showPoll = false;
                    this.isUpdatingPoll = false;

                    localStorage.setItem("userPoll",JSON.stringify(this.formsData.models));

                    xhrFetch(wsURLs.updatePollData,{
                        method:"POST",
                        headers:{
                            'Content-Type': 'application/json',
                            //'Cookie': document.cookie
                        },
                        body: JSON.stringify(this.formsData.models)
                    })
                    .then(responseText => {
                        //console.log(responseText)
                        this.loadPollData();
                    })
                    .catch(e => {
                        console.error("Error: " + e)
                    })

                }
                else if (formerPollData === JSON.stringify(this.formsData.models)){  // if same , show the poll and do not submit.
                    this.showPoll = false;
                    this.loadPollData();
                }
                else {              // insert new poll data

                    this.showPoll = false;
                    this.formsData.models.fhid = this.startCardText;

                    localStorage.setItem("userPoll",JSON.stringify(this.formsData.models));

                    xhrFetch(wsURLs.insertPollData,{
                        method:"POST",
                        headers:{
                            'Content-Type': 'application/json',
                            //'Cookie': document.cookie
                        },
                        body: JSON.stringify(this.formsData.models)
                    })
                    .then(responseText => {
                        this.loadPollData();
                    })
                    .catch(e => {
                        console.error(e)
                    })
                    
                }
            }
            else {
                this.$q.notify({
                    message: 'Please fill out the entire form.',
                    color: 'red'
                  })
            }
        },
        loadPollData(){
            let newTemplate = {};

            questions.forEach(item => {
                if(item.type === "inputtext" || item.type === "slider"){
                    newTemplate[item.key] = {
                        type:item.type
                    }
                }
                else {
                    if(item.type === "dropdown"){
                        newTemplate[item.key] = {
                            type:item.type,
                            items:item.items
                        }
                    }
                    else if(item.type === "singlechoice"){
                        let newItems = [];
                        item.items.forEach(el => {
                            newItems.push(el.name);
                        })
                        newTemplate[item.key] = {
                            type:item.type,
                            items:newItems
                        }
                    }
                }
            })

            //console.log(JSON.stringify(newTemplate))
        
            xhrFetch(wsURLs.fetchPollData,{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTemplate)
            })
            .then(responseText => {
                this.pollResultData = JSON.parse(responseText);
                //  console.log(responseText)
            })
            .catch(e =>{
                console.error("Error: " + e)
            })
        },
        changePollData(){
            this.showDialog = false;
            this.isUpdatingPoll = true;
            this.formsData.models = JSON.parse(
                localStorage.getItem("userPoll")
            );
            this.showPoll = true;
        },
        /*
        setPageCookie(){
            // this is all for debugging, will be obsolete

            const cookie = document.cookie;
            if(cookie.length === 0){
                //console.log("No cookie")
                this.netlabCookie = bypassCookie;
            }
            else {
                //console.log("Netlab cookie found")
                //console.log(cookie)
                this.netlabCookie = cookie;
            }

            // COMMENT THIS OUT FOR IT TO WORK IN PROD.
            //this.netlabCookie = bypassCookie;
        }
        */
    },
    beforeMount(){
        this.hasInsertedData = localStorage.getItem("userPoll")

        if(this.hasInsertedData){
            console.log("User has already entered data.")
        }

        questions.forEach((value,index) => {
            this.formsData.models[value.key] = null;
        })

        //this.setPageCookie();  
        //this.loadPollData();
    },
    watch:{
        startCardText(newVal){
            this.startButtonDisabled = !Boolean(newVal.length)
        }
    }
})

Quasar.setCssVar("primary",'#4ed130')
app.use(Quasar,{config:{notify:{}}})

app.mount('#q-app')