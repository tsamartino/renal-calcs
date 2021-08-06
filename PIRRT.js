// Arrays that define table rows
let q_table = [
	{label:"Qb (mL/min)", type:"input"},
	{label:"Qd (mL/hr)", type:"input"},
	{label:"Qd (mL/min)", type:"calculated"},
	{label:"Qrep pre(mL/hr)", type:"input"},
	{label:"Qrep pre(mL/min)", type:"calculated"},
	{label:"Qrep post(mL/hr)", type:"input"},
	{label:"Qrep post (mL/min)", type:"calculated"},
	{label:"Qpfr (mL/hr)", type:"input"},
	{label:"Qpfr(mL/min)", type:"calculated"}
]

let qeff_table = [
	{label:"Qeff (mL/hr)", type:"calculated"},
	{label:"Saturation ratio (%)", type:"input"}
]

let calc_table = [
	{label:"Filtration fraction", type:"calculated"},
	{label:"Qb/Qd", type:"calculated"},
	{label:"PFR Rate (mL/kg/hr)", type:"calculated"},
	{label:"Volume of distribution", type:"calculated"},
	{label:"Calc. Clearance (mL/hr)", type:"calculated"},
	{label:"Calc. Clearance (mL/min)", type:"calculated"}
]

let time_into_treatment = [
	{label:"Predicted BUN3", type:"calculated"},
	{label:"% Hourly URR", type:"calculated"},
	{label:"Overall URR", type:"calculated"}
]

// Function to generate tables
function generateTable(table, data) {
    let x = 1;
    for (let element of data) {
        let row = table.insertRow();
        let n = 0;
        for (var key in element) {
            var value = element[key];
            if (n == 0) {
                let cell = row.insertCell();
                let text = document.createTextNode(element["label"]);
                cell.appendChild(text);
                cell.outerHTML = '<th scope="row">' + element["label"] + '</th>';
                n++;
            } else {
                if (table.id == "time_into_treatment") {
                    var length = 10;
                } else {
                    var length = 9;
                }
                while (n < length) {
                    n++;
                    let cell = row.insertCell();
                    if (value == "input") {
                        var id = x + "" + n - 1;
                        var id = id.toString();
                        cell.innerHTML = '<div class="input-group input-group-sm"><input type="number" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" id="' + table.id + id + '" oninput="calculate()"></div>';
                    } else {
                        var id = x + "" + n - 1;
                        var id = id.toString();
                        cell.innerHTML = "-";
                        cell.setAttribute("id", table.id + id);
                        if (table.id == "q_table") {
                            cell.setAttribute("onchange", "calculate()");
                            cell.setAttribute("id", "result" + (id - 10));
                        } else if (table.id == "qeff_table") {
                            cell.setAttribute("id", "qeff_result" + id)
                        }
                    }
                }
                x++;
            }
        }
    }
}

function calculate() {
    var id = event.target.id;
    var id = id.toString();
    if (id == "pcv") {
    	// Recalculate all filtration fraction values
    	console.log("pcv changed")
    }else{
	    var x = document.getElementById(id).value;
	    var resultid = event.target.id.replace("q_table", "result");
	    try {
	        result = x / 60;
	        document.getElementById(resultid).innerHTML = +result.toFixed(2);
	    } catch {}

	    var bw = Number(document.getElementById("bw").value.replace(null,0));
	    var pcv = exactMath.mul(Number(document.getElementById("pcv").value.replace(null,0)), .01);

	    var qb_min = Number(document.getElementById("q_table1" + id.slice(-1)).value.replace(null,0));
  	  var qd_hr = Number(document.getElementById("q_table2" + id.slice(-1)).value.replace(null,0));
  	  var qd_min = Number(document.getElementById("result2" + id.slice(-1)).innerHTML.replace("-", "0"));
  	  var qrep_pre_hr = Number(document.getElementById("q_table4" + id.slice(-1)).value.replace(null,0));
  		var qrep_pre_min = Number(document.getElementById("result4" + id.slice(-1)).innerHTML.replace("-", "0"));
  		var qrep_post_hr = Number(document.getElementById("q_table6" + id.slice(-1)).value.replace(null, 0));
  		var qrep_post_min = Number(document.getElementById("result6" + id.slice(-1)).innerHTML.replace("-", "0"));
  		var qpfr_hr = Number(document.getElementById("q_table8" + id.slice(-1)).value.replace(null, 0));
  		var qpfr_min = Number(document.getElementById("result8" + id.slice(-1)).innerHTML.replace("-", "0"));
  		var sat = exactMath.mul(Number(document.getElementById("qeff_table2" + id.slice(-1)).value.replace(null,0)), .01);

  		// console.log("qb_min", qb_min, "qd_hr", qd_hr, "qd_min", qd_min, "qrep_pre_hr", qrep_pre_hr, "qrep_pre_min", qrep_pre_min, "qrep_post_hr", qrep_post_hr, 
  		// 	"qrep_post_min", qrep_post_min, "qpfr_hr", qpfr_hr, "qpfr_min", qpfr_min)

	    if (id.slice(0, 7) == "q_table") {
	        var result = exactMath.add(qd_hr, qrep_pre_hr, qrep_post_hr, qpfr_hr);
	        var x = document.getElementById(id).value;
	        var resultid = "qeff_result1" + id.slice(-1);
	        if (id.slice(-2, -1) != 1) {
	            document.getElementById(resultid).innerHTML = +result.toFixed(2);
	        }
	    }

	    // Filtration fraction calculation -- WHY IS THIS WRONG?!
	    var ffresult = exactMath.div((exactMath.add(qrep_pre_min, qrep_post_min, qpfr_min)), exactMath.mul(exactMath.add(qrep_pre_min, qb_min), exactMath.div(exactMath.sub(1, pcv),100)));	    
	    if (!isNaN(ffresult)) {
		    var ffresultid = "calculated_values1" + id.slice(-1);
		    document.getElementById(ffresultid).innerHTML = +ffresult.toFixed(2) + " %";
	    }

	    // Qb/Qd calculation
	    if (qb_min != 0 && qd_min != 0) {
				var qb_qdresult = exactMath.div(qb_min, qd_min);
	    	var qb_qdresultid = "calculated_values2" + id.slice(-1);
	    	document.getElementById(qb_qdresultid).innerHTML = +qb_qdresult.toFixed(2);
	    }

	    // PFR Rate calculation
	    var pfrresult = exactMath.div(qpfr_hr, bw)
	    var pfrresultid = "calculated_values3" + id.slice(-1);
	    if (pfrresult != 0 && !isNaN(pfrresult)) {
	    	document.getElementById(pfrresultid).innerHTML = +pfrresult.toFixed(2);
	    }else if (isNaN(pfrresult) || pfrresult == 0) {
	    	document.getElementById(pfrresultid).innerHTML = "0";
	    }

	    // Calc. clearance (mL/hr) calculation
	    var satresult = exactMath.div((exactMath.mul(exactMath.add(qd_hr, qrep_pre_hr, qrep_post_hr, qpfr_hr), sat)), 
	    	exactMath.add(1, exactMath.div(qrep_pre_hr, (exactMath.mul(qb_min, 60)))))
	    if (!isNaN(satresult)) {
	    	var calcclearid = "calculated_values5" + id.slice(-1);
	    	document.getElementById(calcclearid).innerHTML = +satresult.toFixed(2);
	    }
    }
}

// Fills Volume of distribution values in calculated table
function distvolume() {
	let n = 0;
	while (n < 8) {
		n++;
		document.getElementById("calculated_values4" + n).innerHTML = document.getElementById("vd_ml").value;
	}
}

// Fills Predicted BUN3 values in Time into Treatment table
function bun() {
	document.getElementById("time_into_treatment11").innerHTML = document.getElementById("bun").value;
}

// Generates tables using ID given from HTML and arrays specifying row headers at top of file
window.onload = function() {
    var qtable = document.getElementById("q_table");
    var qefftable = document.getElementById("qeff_table");
    var calctable = document.getElementById("calculated_values");
    var timeintotreatment = document.getElementById("time_into_treatment");
    generateTable(qtable, q_table);
    generateTable(qefftable, qeff_table);
    generateTable(calctable, calc_table);
    generateTable(timeintotreatment, time_into_treatment);
}





