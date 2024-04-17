class Engine {

    static load(...args) {
        window.onload = () => new Engine(...args);
    }

    constructor(firstSceneClass, storyDataUrl) {

        this.firstSceneClass = firstSceneClass;
        this.storyDataUrl = storyDataUrl;

        this.header = document.body.appendChild(document.createElement("h1"));
        this.output = document.body.appendChild(document.createElement("div"));
        this.actionsContainer = document.body.appendChild(document.createElement("div"));

        fetch(storyDataUrl).then(
            (response) => response.json()
        ).then(
            (json) => {
                this.storyData = json;
                this.gotoScene(firstSceneClass)
            }
        );

        // create a set to keep track of visited locations
        this.visitedLocations = new Set();

        // set of available items
        this.availableItems = new Set();

        // current item in hand 
        this.currentItem = null;

        // Items we gave Asher
        this.asherItems = new Set();
    }

    gotoScene(sceneClass, data) {
        this.scene = new sceneClass(this);
        if (data != undefined && !data.endsWith("_Limbo") && data != "cafe"){
            this.visitedLocations.add(data);
        }
        this.scene.create(data);
    }

    addChoice(action, data) {
        let button = this.actionsContainer.appendChild(document.createElement("button"));
        button.innerText = action;
        button.onclick = () => {
            while(this.actionsContainer.firstChild) {
                this.actionsContainer.removeChild(this.actionsContainer.firstChild)
            }
            this.scene.handleChoice(data);
        }
    }

    setTitle(title) {
        document.title = title;
        this.header.innerText = title;
    }

    show(msg) {
        let div = document.createElement("div");
        div.innerHTML = msg;
        this.output.appendChild(div);
    }

    // check if you have visited a location by seeing if the location is in the visited set
    hasVisited(locationKey){
        return this.visitedLocations.has(locationKey);
    }

    getVisitedCount(){
        return this.visitedLocations.size;
    }

    pickupItem(item){
        if(this.currentItem != null){
            this.show("You are already holding " + item + ". You must take the item to Asher before picking up another.")
        }
        else if(this.isItemPicked(item)){
            this.show("You have already picked up" + item + ". Go give it to Asher if you have not already!")
        }
        else{
            this.currentItem = item;
            this.availableItems.delete(item);
            this.show("You have picked up " + item);
            
        }
    }
    isItemPicked(item){
        return !this.availableItems.has(item);
    }

    giveItem(){
        if(this.currentItem){
            this.show("You give " + this.currentItem + " to Asher.");
            this.asherItems.add(this.currentItem);
            this.currentItem = null;
        } else {
            this.show("You have no item to give.");
        }
    }

    checkForWinner(){
        if (this.asherItems.has("AVALANCHE ASHER'S BOOTS")){
            if (this.asherItems.has("AVALANCHE ASHER'S SNOWBOARD")){
                if(this.asherItems.has("AVALANCHE ASHER'S BINDINGS")){
                    return true;
                }
            }
        }
        return false;
    }
}

class Scene {
    constructor(engine) {
        this.engine = engine;
    }

    create() { }

    update() { }

    handleChoice(action) {
        console.warn('no choice handler on scene ', this);
    }
}