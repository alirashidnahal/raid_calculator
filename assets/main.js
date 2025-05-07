'use strict';

let raidCalc = document.getElementById('raid-calculator');

let availableSpace = raidCalc.querySelector('#availableSpace');
let totalSpace = raidCalc.querySelector('#totalSpace');
let raidOptions = raidCalc.querySelectorAll("input[name=raidConf]");
let dNum;
let dSize;
let raid;
if(raidCalc) {
  let disksNumber = raidCalc.querySelector('#numberOfDisks'),
    diskSize = raidCalc.querySelector('#sizeOfEachDrive');

  raid = 0;

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

		for(let i = 0; i < raidOptions.length; i++ ) {
			raidOptions[i].addEventListener('change', function() {
				unsetSelectedRaidConfig();
				raid = this.value;
				this.parentNode.classList.add('selected');
				updateTotal();
			});
		}

	}

	function unsetSelectedRaidConfig () {
		for(let i = 0; i < raidOptions.length; i++ ) {
			raidOptions[i].parentNode.classList.remove('selected');
		}
	}

	function checkRaidOptions () {

		disableRaid();

		if(dNum === 1) {
			enableRaidOption([0]);
		}

		if(dNum === 2) {
			enableRaidOption([0, 1]);
		}

		if(dNum !== 2 && dNum >= 3) {
			enableRaidOption([0, 5]);
		}

		if(dNum >= 4) {
			if(dNum%2 === 0) enableRaidOption([6, 10]);
			if(dNum%2 === 1) enableRaidOption([6]);
		}

		if(dNum >= 5 && dNum > 4) {
			if(dNum%2 === 0) enableRaidOption([0, 5, 6]);
		}

		if(dNum >= 6) {
			enableRaidOption([0, 50]);
		}

		if(dNum >= 8) {
			enableRaidOption([0, 60]);
		}

	}

	function enableRaidOption (list) {
		for(let i = 0; i <= list.length; i++ ) {
			enableRaidOptionByValue(list[i]);
		}
	}

	function enableRaidOptionByValue (val) {
		for(let i = 0; i < raidOptions.length; i++ ) {
			if(raidOptions[i].value == val)
				enableRaid(raidOptions[i]);
		}
	}

	function enableRaid (el) {
		el.parentNode.classList.remove('inactive');
		el.removeAttribute('disabled');
	}

	function disableRaid (el) {
		for(let i = 0; i < raidOptions.length; i++ ) {
			raidOptions[i].parentNode.classList.add('inactive');
			raidOptions[i].setAttribute('disabled', 'disabled');
		}
	}

	function updateBar (total) {
    let availableSpace = dNum * dSize;
    let percent = (availableSpace / 100);
    let availablePercent = parseInt(total / percent);

    raidCalc.querySelector('.progress-bar').setAttribute('style', 'width: ' + availablePercent + '%');
	}

	function updateTotal () {
		dNum = parseInt(dNum);
		dSize = parseInt(dSize);
		raid = parseInt(raid);

		if( dNum > 0 && dSize > 0 && raid >= 0 ) {

      let total = -1;

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
