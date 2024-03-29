var cal = {
  
  mName : ["Ocak", "Subat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Agustos", "Eylul", "Ekim", "Kasım", "Aralık"], 
  data : null, 
  sDay : 0, 
  sMth : 0, 
  sYear : 0, 
  sMon : false, 

  
  list : function () {
  
    cal.sMth = parseInt(document.getElementById("cal-mth").value); 
    cal.sYear = parseInt(document.getElementById("cal-yr").value);
    var daysInMth = new Date(cal.sYear, cal.sMth+1, 0).getDate(),
        startDay = new Date(cal.sYear, cal.sMth, 1).getDay(), 
        endDay = new Date(cal.sYear, cal.sMth, daysInMth).getDay(); 

    
    cal.data = localStorage.getItem("cal-" + cal.sMth + "-" + cal.sYear);
    if (cal.data==null) {
      localStorage.setItem("cal-" + cal.sMth + "-" + cal.sYear, "{}");
      cal.data = {};
    } else {
      cal.data = JSON.parse(cal.data);
    }

    
    var squares = [];
    if (cal.sMon && startDay != 1) {
      var blanks = startDay==0 ? 7 : startDay ;
      for (var i=1; i<blanks; i++) { squares.push("b"); }
    }
    if (!cal.sMon && startDay != 0) {
      for (var i=0; i<startDay; i++) { squares.push("b"); }
    }

    
    for (var i=1; i<=daysInMth; i++) { squares.push(i); }

    
    if (cal.sMon && endDay != 0) {
      var blanks = endDay==6 ? 1 : 7-endDay;
      for (var i=0; i<blanks; i++) { squares.push("b"); }
    }
    if (!cal.sMon && endDay != 6) {
      var blanks = endDay==0 ? 6 : 6-endDay;
      for (var i=0; i<blanks; i++) { squares.push("b"); }
    }

    
    var container = document.getElementById("cal-container"),
        cTable = document.createElement("table");
    cTable.id = "calendar";
    container.innerHTML = "";
    container.appendChild(cTable);

    
    var cRow = document.createElement("tr"),
        cCell = null,
        days = ["Pzt", "Sal", "Car", "Per", "Cuma", "Ctesi", "Paz"];
    if (cal.sMon) { days.push(days.shift()); }
    for (var d of days) {
      cCell = document.createElement("td");
      cCell.innerHTML = d;
      cRow.appendChild(cCell);
    }
    cRow.classList.add("head");
    cTable.appendChild(cRow);

    
    var total = squares.length;
    cRow = document.createElement("tr");
    cRow.classList.add("day");
    for (var i=0; i<total; i++) {
      cCell = document.createElement("td");
      if (squares[i]=="b") { cCell.classList.add("blank"); }
      else {
        cCell.innerHTML = "<div class='dd'>"+squares[i]+"</div>";
        if (cal.data[squares[i]]) {
          cCell.innerHTML += "<div class='evt'>" + cal.data[squares[i]] + "</div>";
        }
        cCell.addEventListener("click", function(){
          cal.show(this);
        });
      }
      cRow.appendChild(cCell);
      if (i!=0 && (i+1)%7==0) {
        cTable.appendChild(cRow);
        cRow = document.createElement("tr");
        cRow.classList.add("day");
      }
    }

    
    cal.close();
  },

  show : function (el) {
  
    cal.sDay = el.getElementsByClassName("dd")[0].innerHTML;

    
    var tForm = "<h1>" + (cal.data[cal.sDay] ? "EDIT" : "Etkinlik") + " Ekle</h1>";
    tForm += "<div id='evt-date'>" + cal.sDay + " " + cal.mName[cal.sMth] + " " + cal.sYear + "</div>";
    tForm += "<textarea id='evt-details' required>" + (cal.data[cal.sDay] ? cal.data[cal.sDay] : "") + "</textarea>";
    tForm += "<input type='button' value='Kapat' onclick='cal.close()'/>";
    tForm += "<input type='button' value='Sil' onclick='cal.del()'/>";
    tForm += "<input type='submit' value='Kaydet'/>";

    
    var eForm = document.createElement("form");
    eForm.addEventListener("submit", cal.save);
    eForm.innerHTML = tForm;
    var container = document.getElementById("cal-event");
    container.innerHTML = "";
    container.appendChild(eForm);
  },

  close : function () {
  

    document.getElementById("cal-event").innerHTML = "";
  },

  save : function (evt) {
  

    evt.stopPropagation();
    evt.preventDefault();
    cal.data[cal.sDay] = document.getElementById("evt-details").value;
    localStorage.setItem("cal-" + cal.sMth + "-" + cal.sYear, JSON.stringify(cal.data));
    cal.list();
  }

  
};


window.addEventListener("load", function () {
  
  var now = new Date(),
      nowMth = now.getMonth(),
      nowYear = parseInt(now.getFullYear());

  
  var month = document.getElementById("cal-mth");
  for (var i = 0; i < 12; i++) {
    var opt = document.createElement("option");
    opt.value = i;
    opt.innerHTML = cal.mName[i];
    if (i==nowMth) { opt.selected = true; }
    month.appendChild(opt);
  }

  
  var year = document.getElementById("cal-yr");
  for (var i = nowYear-10; i<=nowYear+10; i++) {
    var opt = document.createElement("option");
    opt.value = i;
    opt.innerHTML = i;
    if (i==nowYear) { opt.selected = true; }
    year.appendChild(opt);
  }

  
  document.getElementById("cal-set").addEventListener("click", cal.list);
  cal.list();
});