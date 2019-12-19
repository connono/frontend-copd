import Mock from 'mockjs';

let data = [];

for(var i=0; i<15; i++){
	data.push({
		patientId: '646862',
		name: '闫梅凤',
		sex: '女',
		age: '44岁',
		tag: '高血压 糖尿病',
		complianceRate: 1,
		manageStartTime: '2019-12-09 11:12:58',
		manageEndTime:'',
		doctor:'夏永辉',
	})
}

export default [
  {
	url: '/patientList',
	type: 'get',
	response: config => {
		return {
			code: 20000,
			data: data
		}
	}
  }
]