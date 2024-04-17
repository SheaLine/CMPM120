class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.show(`"Spirits Slopes" takes place in an expansive ski and snowboard resort in the
        middle of an enchanted mountain range. There is a myth on the resort of a mystical
        snowboarder named Avalanche Asher. It is said that he could float through any terrain
        effortlessly hitting the gnarliest jumps on the mountain. He used to be at the mountain
        every day of the winter until one day he just seemed to have vanished without reason.
        Ever since Avalanche Asher's disappearance, there has been an endless winter across
        the region.\n`);
        this.engine.addChoice("Begin the story");

        // add items for this particular game.
        this.engine.availableItems.add("AVALANCHE ASHER'S SNOWBOARD");
        this.engine.availableItems.add("AVALANCHE ASHER'S BINDINGS");
        this.engine.availableItems.add("AVALANCHE ASHER'S BOOTS");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
    }
}

class Location extends Scene {
    create(key) {
        // special case Locations
        let locationData = this.engine.storyData.Locations[key]; // TODO: use `key` to get the data object for the current story location   
        if (key == "Blue" && this.engine.hasVisited("Avalanche Asher 1")) { this.engine.show(locationData.secretBody);}
        else {this.engine.show(locationData.Body);} // TODO: replace this text by the Body of the location data
        
        if (key == "Gondola"){
            if (!this.engine.hasVisited("Avalanche Asher 1")){
                for (let first of locationData.first_Choices){
                    this.engine.addChoice(first.Text, first)
                }
            }
            else{
                for (let secret of locationData.Gondola_visited){
                    this.engine.addChoice(secret.Text, secret);
                }
            }
        }

         // Location counter
         if (key == "Lodge"){
            // let text = "";
            // let iter = this.engine.availableItems.values();
            // for (const entry of iter) {text += entry; text += " ";};
            // this.engine.show(text);
            let visitedCount = this.engine.getVisitedCount();
            this.engine.show("You have visited " + visitedCount + " out of 22 locations.");
            if (this.engine.visitedLocations.size >= 22){
                for (let secret of locationData.Visited_Everywhere){
                    this.engine.addChoice(secret.Text, secret);
                }
            }
        }

        // Normal location choice handling
        if(locationData.Choices != undefined) { // TODO: check if the location has any Choices
            // secret paths open or not?
            if (this.engine.hasVisited("Avalanche Asher 1") && locationData.Gondola_visited){
                for (let secret of locationData.Gondola_visited){
                    this.engine.addChoice(secret.Text, secret);
                }
            }

            // normal path locations
            for(let choice of locationData.Choices) { // TODO: loop over the location's Choices
                this.engine.addChoice(choice.Text, choice); // TODO: use the Text of the choice
                // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
            }
        }

        // Item tracker and handling
        // check it item is available at current location
        // if(locationData.Items != undefined){
        //     for (let object of locationData.Items){
        //         if (object.item){
        //             this.engine.addChoice(object.text, () => this.engine.pickupItem(object.item));
        //         }
        //     }
        // }
        
    }

    handleChoice(choice) {
        if(choice.Target) {
            this.engine.show("&gt; "+ choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else if (choice.Action === "pickupItem"){
            this.engine.pickupItem(choice.Item);
            //this.engine.show(choice.currentLocation + "_Limbo");
            this.engine.gotoScene(Location, choice.currentLocation + "_Limbo");
        } else if (choice.Action === "giveItem"){
            this.engine.giveItem(choice.Item);
            let isWin = this.engine.checkForWinner();
            if (isWin){
                this.engine.gotoScene(Location, "End");
                this.engine.gotoScene(End);
            } else{
                this.engine.gotoScene(Location, choice.currentLocation + "_Limbo");
            }
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'spiritSlopes.json');
//Engine.load(Start, 'myStory.json');