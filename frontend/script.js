
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
}


// How? Make a request in your browser, check the network tab under Request Headers and get the Cookie property
const bypassCookie = "netlabs_roadblock=a1a1fec39ad74ed107673c8efd8a1010b8470261d1bd3df10201c8e05eb69958";


var app = Vue.createApp({
    data(){
        return {
            hasNotEnteredPoll:!Boolean(localStorage.getItem("hasNotEnteredPoll")),
            showPoll:false,
            showDialog:true,
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
        validate(){
            return Object.values(this.formsData.models).every(model => model != null || undefined)
        },
        submit(){
            if(this.validate()){
                // send data to the WebService
                //console.log("All good!");
                this.showPoll = false;
                this.formsData.models.fhid = this.startCardText;
                //console.log(JSON.stringify(this.formsData.models))

                // using mozilla fetch api to make post request
                fetch(wsURLs.insertPollData,{
                    method:"POST",
                    headers:{
                        'Content-Type': 'application/json',
                        'Cookie': this.netlabCookie
                    },
                    body: JSON.stringify(this.formsData.models)
                })
                .then(res => {
                    res.text().then(text  => {
                        //console.log(text);
                        this.loadPollData();
                    })
                })
                .catch(e => {
                    console.error(e)
                })
                
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
        
            fetch(wsURLs.fetchPollData,{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json',
                    'Cookie': this.netlabCookie
                },
                body: JSON.stringify(newTemplate)
            })
            .then(res => res.json())
            .then(json => {
                this.pollResultData = json;
                //console.log(json)
            })
        },
        setPageCookie(){
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
    },
    beforeMount(){
        questions.forEach((value,index) => {
            this.formsData.models[value.key] = null;
        })

        this.setPageCookie();  
        //this.loadPollData();
    },
    computed: {
        
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