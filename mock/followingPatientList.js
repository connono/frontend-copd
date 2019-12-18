import Mock from 'mockjs';

let data = [{
		Id: 641509,
		name:'葛传斌',
		sex:'男',
		age:'61岁',
		tag:'高血压',
		complianceRate: 1,
		manageLevel:1,
		manageLevelStartDateTime: '2019-10-12',
		followupTimes: 0,
		lastFollowupDate: null,
		lastFollowupDays: null,
		followupDate: '2018-09-02',
		followupDays: -471,
		doctor:'2018002',
		type:'高血压常规随访',
		position:'待随访',
	},{
		Id: 641511,
		name:'袁建亮',
		sex:'男',
		age:'51岁',
		tag:'高血压',
		complianceRate: 1,
		manageLevel:1,
		manageLevelStartDateTime: '2019-10-12',
		followupTimes: 0,
		lastFollowupDate: null,
		lastFollowupDays: null,
		followupDate: '2018-09-06',
		followupDays: -467,
		doctor:'2018002',
		type:'高血压常规随访',
		position:'待随访',
	},{
		Id: 645354,
		name:'李军山',
		sex:'男',
		age:'50岁',
		tag:'高血压',
		complianceRate: 1,
		manageLevel: 2,
		manageLevelStartDateTime: '2019-7-8',
		followupTimes: 1,
		lastFollowupDate: '2019-06-18',
		lastFollowupDays: -200,
		followupDate: '2019-07-02',
		followupDays: -168,
		doctor: '赵敏',
		type: '高血压常规随访',
		position: '待随访'
}]

export default [
  {
	url: '/followingPatientList',
	type: 'get',
	response: config => {
		return {
			code: 20000,
			data: data
		}
	}
  },{
	url: '/followingPatientList/ignore',
	type: 'post',
	response: config => {
		const { Id } = config.body;
		for(var i=0; i<data.length; i++){
			if(data[i].Id == Id){
				data[i].position = '已忽略';
			}
		}
		return {
			code: 20000
		}
	}
  }
]