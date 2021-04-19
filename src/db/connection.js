const mongoose = require("mongoose");
const URI = "mongodb+srv://kent:0wr5H57AP8A7MIuf@cluster0.bw1i3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(URI, {
    useNewUrlParser:true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

