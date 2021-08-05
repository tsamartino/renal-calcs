let q_table = [
	// {label:"Prescription", type:"empty"},
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

function generateTable(table, data) {
	let x = 1;
	for (let element of data) {
		let row = table.insertRow();
		let n = 0;
		for (var key in element) {
			var value = element[key];
			if (n == 0) {
				let cell = row.insertCell();
				let text = document.createTextNode(element[key]);
				cell.appendChild(text);
				cell.outerHTML = '<th scope="row">'+value+'</th>';
				n++;
			}else{
				while (n < 9) {
					n++;
					let cell = row.insertCell();
					if (value == "input") {
						var id = x + "" + n-1;
						var id = id.toString();
						//only difference is table ID and oninput
						cell.innerHTML = '<div class="input-group input-group-sm"><input type="number" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" id="'+table.id+id+'" oninput="min_to_hour()"></div>';
					}else{
						var id = x + "" + n-1;
						var id = id.toString();
						cell.innerHTML = "-";
						//only difference is table ID
						cell.setAttribute("id", table.id+id);
						if (table.id == "q_table") {
							cell.setAttribute("onchange", "qeff_calc()");
							cell.setAttribute("id", "result"+(id-10));
						} else if (table.id == "qeff_table") {
							cell.setAttribute("id", "qeff_result"+id)
						}
					}
				}
				x++;
			}
		}
	}
}

function min_to_hour() {
	var id = event.target.id;
	var id = id.toString();
	var x = document.getElementById(id).value;
	var resultid = event.target.id.replace("q_table", "result");
	try {
		result = x / 60;
		document.getElementById(resultid).innerHTML = +result.toFixed(2);
	}catch{}
	qeff_calc();
}

function qeff_calc() {
	var id = event.target.id;
	console.log(id)
	var id = id.toString();
	var result = Number(document.getElementById("result2"+id.slice(-1)).innerHTML.replace("-","0")) +
							 Number(document.getElementById("result4"+id.slice(-1)).innerHTML.replace("-","0")) +
							 Number(document.getElementById("result6"+id.slice(-1)).innerHTML.replace("-","0")) +
							 Number(document.getElementById("result8"+id.slice(-1)).innerHTML.replace("-","0"));		
	var x = document.getElementById(id).value;
	var resultid = "qeff_result1"+id.slice(-1)
	if (id.slice(-2, -1) != 1) {
		document.getElementById(resultid).innerHTML = +result.toFixed(2);
	}
}

window.onload = function () {
	var qtable = document.getElementById("q_table");
	var qefftable = document.getElementById("qeff_table");
	var calctable = document.getElementById("calculated_values");
	var timeintotreatment = document.getElementById("time_into_treatment");
	generateTable(qtable, q_table);
	generateTable(qefftable, qeff_table);
	generateTable(calctable, calc_table);
	generateTable(timeintotreatment, time_into_treatment);
}