'use strict'; 

	var raidCalc = document.getElementById('raid-calculator');

	if(raidCalc) {
		var disksNumber = raidCalc.querySelector('#numberOfDisks'),
			diskSize = raidCalc.querySelector('#sizeOfEachDrive'),
			availableSpace = raidCalc.querySelector('#availableSpace'),
			totalSpace = raidCalc.querySelector('#totalSpace'),
			raidOptions = raidCalc.querySelectorAll("input[name=raidConf]");

		var dNum, dSize, raid = 0, tSpace;

		disksNumber.addEventListener('keyup', function () {
			if(this.value > 0) {
				dNum = this.value; 
				checkRaidOptions();
				updateTotal();
			}
		});

		diskSize.addEventListener('keyup', function () {
			if(this.value > 0) {
				dSize = this.value; 
				updateTotal();
			}
		});

		disksNumber.addEventListener('change', function () {
			if(this.value > 0) {
				dNum = this.value; 
				checkRaidOptions();
				updateTotal();
			}
		});

		diskSize.addEventListener('change', function () {
			if(this.value > 0) {
				dSize = this.value; 
				updateTotal();
			}
		});

		for( var i = 0; i < raidOptions.length; i++ ) {
			raidOptions[i].addEventListener('change', function() {
				unsetSelectedRaidConfig();
				raid = this.value;
				this.parentNode.classList.add('selected');
				updateTotal();
			});
		}

	}

	function unsetSelectedRaidConfig () {
		for( var i = 0; i < raidOptions.length; i++ ) {
			raidOptions[i].parentNode.classList.remove('selected');
		}
	}

	function checkRaidOptions () {
		
		disableRaid();

		if(dNum == 1) {
			enableRaidOption([0]);
		} 

		if(dNum == 2) {
			enableRaidOption([0, 1]);
		} 

		if(dNum !== 2 && dNum >= 3) {
			enableRaidOption([0, 5]);
		}

		if(dNum >= 4) {
			if(dNum%2 == 0) enableRaidOption([6, 10]);
			if(dNum%2 == 1) enableRaidOption([6]);
		}

		if(dNum >= 5 && dNum > 4) {
			if(dNum%2 == 0) enableRaidOption([0, 5, 6]);
		}

		if(dNum >= 6) {
			enableRaidOption([0, 50]);
		}

		if(dNum >= 8) {
			enableRaidOption([0, 60]);
		}

	}

	function enableRaidOption (list) {
		for(var i = 0; i <= list.length; i++ ) {
			enableRaidOptionByValue(list[i]);
		}
	}

	function enableRaidOptionByValue (val) {
		for( var i = 0; i < raidOptions.length; i++ ) {
			if(raidOptions[i].value == val)
				enableRaid(raidOptions[i]);
		}
	}

	function enableRaid (el) {
		el.parentNode.classList.remove('inactive');
		el.removeAttribute('disabled');
	}

	function disableRaid (el) {
		for( var i = 0; i < raidOptions.length; i++ ) {
			raidOptions[i].parentNode.classList.add('inactive');
			raidOptions[i].setAttribute('disabled', 'disabled');
		}
	}

	function updateBar (total) {
		var availableSpace = dNum * dSize;
		var percent = (availableSpace/100);
		var availablePercent = parseInt(total/percent); 

		raidCalc.querySelector('.progress-bar').setAttribute('style', 'width: ' + availablePercent + '%');
	}

	function updateTotal () {
		dNum = parseInt(dNum);
		dSize = parseInt(dSize);
		raid = parseInt(raid);

		if( dNum > 0 && dSize > 0 && raid >= 0 ) {

			var total = -1;

			if(raid === 0 && dNum >= 1)
				total = dNum * dSize;

			if(raid === 1 && dNum === 2)
				total = dSize;

			if(raid === 10 && dNum >= 4 && (dNum % 2) === 0 )
				total = (dSize * dNum) / 2;

			if(raid === 5 && dNum >= 3)
				total = (dSize * dNum) - dSize;

			if(raid === 6 && dNum >= 4)
				total = (dSize * dNum) - dSize * 2;

			if(raid === 50 && dNum >= 6)
				total = ((dSize * (dNum/2)) - dSize ) * 2;

			if(raid === 60 && dNum >= 8)
				total = ((dSize * (dNum/2)) - dSize*2 ) * 2;

			availableSpace.innerText = total >=0 ? total : 'امکان پذیر نیست';
			totalSpace.innerText = dNum * dSize;
			updateBar(total);
		}
	}