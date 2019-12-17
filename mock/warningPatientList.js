import Mock from 'mockjs'

let data = [{
	patientID: '20115533',
	patientName:"李军山",
	sexText:"男",
	sex:1,
	age:38,
	tag:'高血压',
	alertItems:[{
	  alertName: '月平均血压异常',
	  alertReason: '153/97 mmHg',
	  alertDateTime: '2019-12-05 03:00:01'
	},{
	  alertName: '月平均血压异常',
	  alertReason: '142/85 mmHg',
	  alertDateTime: '2019-10-22 03:00:01'
	}],
	medication:[{
	  drugName: '左旋氨氯地平片',
	  dosage: '5mg',
	  freq: '',
	  usedDays: 183,
	},{
	  drugName: '酒石酸美托洛尔片',
	  dosage: '50mg',
	  freq: '',
	  usedDays: 183,
	}],
	manage:{
	  manageStatus: 0,
	  manageLevel: 2,
	  manageLevelStartDateTime: '2019-10-12',
	  manageClass: ['高血压'],
	  complianceRate: 2,
	  manageDays: 231,
	  followupTimes: 4,
	  lastFollowupDate: '2019-06-18',
	  lastFollowupDays: -181
	}
},{
	patientID: '20115534',
	patientName:"李军河",
	sexText:"男",
	sex:1,
	age:38,
	tag:'高血压',
	alertItems:[{
	  alertName: '月平均血压异常',
	  alertReason: '153/97 mmHg',
	  alertDateTime: '2019-12-05 03:00:01'
	},{
	  alertName: '月平均血压异常',
	  alertReason: '142/85 mmHg',
	  alertDateTime: '2019-10-22 03:00:01'
	}],
	medication:[{
	  drugName: '左旋氨氯地平片',
	  dosage: '5mg',
	  freq: '',
	  usedDays: 183,
	},{
	  drugName: '酒石酸美托洛尔片',
	  dosage: '50mg',
	  freq: '',
	  usedDays: 183,
	}],
	manage:{
	  manageStatus: 0,
	  manageLevel: 2,
	  manageLevelStartDateTime: '2019-10-12',
	  manageClass: ['高血压'],
	  complianceRate: 2,
	  manageDays: 231,
	  followupTimes: 4,
	  lastFollowupDate: '2019-06-18',
	  lastFollowupDays: -181
	}
},{
	patientID: '20115535',
	patientName:"李军水",
	sexText:"女",
	sex:2,
	age:38,
	tag:'高血压',
	alertItems:[{
	  alertName: '月平均血压异常',
	  alertReason: '153/97 mmHg',
	  alertDateTime: '2019-12-05 03:00:01'
	},{
	  alertName: '月平均血压异常',
	  alertReason: '142/85 mmHg',
	  alertDateTime: '2019-10-22 03:00:01'
	}],
	medication:[{
	  drugName: '左旋氨氯地平片',
	  dosage: '5mg',
	  freq: '',
	  usedDays: 183,
	},{
	  drugName: '酒石酸美托洛尔片',
	  dosage: '50mg',
	  freq: '',
	  usedDays: 183,
	}],
	manage:{
	  manageStatus: 0,
	  manageLevel: 2,
	  manageLevelStartDateTime: '2019-10-12',
	  manageClass: ['高血压'],
	  complianceRate: 2,
	  manageDays: 231,
	  followupTimes: 4,
	  lastFollowupDate: '2019-06-18',
	  lastFollowupDays: -181
	}
},{
	patientID: '20115536',
	patientName:"李军峰",
	sexText:"男",
	sex:1,
	age:38,
	tag:'高血压',
	alertItems:[{
	  alertName: '月平均血压异常',
	  alertReason: '153/97 mmHg',
	  alertDateTime: '2019-12-05 03:00:01'
	},{
	  alertName: '月平均血压异常',
	  alertReason: '142/85 mmHg',
	  alertDateTime: '2019-10-22 03:00:01'
	}],
	medication:[{
	  drugName: '左旋氨氯地平片',
	  dosage: '5mg',
	  freq: '',
	  usedDays: 183,
	},{
	  drugName: '酒石酸美托洛尔片',
	  dosage: '50mg',
	  freq: '',
	  usedDays: 183,
	}],
	manage:{
	  manageStatus: 0,
	  manageLevel: 2,
	  manageLevelStartDateTime: '2019-10-12',
	  manageClass: ['高血压'],
	  complianceRate: 2,
	  manageDays: 231,
	  followupTimes: 4,
	  lastFollowupDate: '2019-06-18',
	  lastFollowupDays: -181
	}
}]

export default [
  {
	url: '/warningPatientList',
	type: 'get',
	response: config => {
		return {
			code: 20000,
			data: data
		}
	}
  },{
	url: '/warningPatientList/delete',
	type: 'post',
	response: (config) => {
		const {patientID} = config.body;
		data = data.filter((item)=>{return item.patientID!=patientID});
		return {
			code: 20000
		}
	}
  }
]