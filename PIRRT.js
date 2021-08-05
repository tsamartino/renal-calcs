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

function generateTableQ(table, data) {
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
	      		cell.innerHTML = '<div class="input-group input-group-sm"><input type="number" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" id="q_table'+id+'" oninput="min_to_hour()"></div>'
	      	}else{
	      		//calculated field
	      		var id = x-1 + "" + n-1;
	      		var id = id.toString();
	      		cell.innerHTML = "-";
	      		cell.setAttribute("onchange", "qeff_calc()")
	      		cell.setAttribute("id", "result"+id)
	      		cell.setAttribute("style", "overflow:hidden;white-space:nowrap;text-overflow:ellipsis;max-width:4ch;")
	      	}
      	}
      	x++;
      }
    }
  }
}

function generateTableQeff(table, data) {
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
						cell.innerHTML = '<div class="input-group input-group-sm"><input type="number" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" id="qeff_table'+id+'" oninput=""></div>'
					}else{
						var id = x + "" + n-1;
						var id = id.toString();
						cell.innerHTML = "-"
						cell.setAttribute("id", "qeff_result"+id)
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
	generateTableQ(qtable, q_table);
	generateTableQeff(qefftable, qeff_table);
}