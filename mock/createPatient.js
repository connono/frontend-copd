import Mock from 'mockjs';

let data = [];

for(var i=0; i<15; i++){
	data.push({
		patientId: 646862,
		name: '闫梅凤',
		sex: '女',
		age: '44岁',
		education: '本科',
		profession: '教师',
		height: '160',
		weight: '50',
		phone: '12345678901',
		createTime: '2019-12-05 03:00:01',
	})
}

export default [
  {
	url: '/createPatient',
	type: 'get',
	response: config => {
		return {
			code: 20000,
			data: data
		}
	}
  }
]