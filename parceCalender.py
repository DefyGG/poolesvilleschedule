import xlrd
import json
# import pyperclip
workbook = xlrd.open_workbook("Complete Calender.xlsx")
worksheet = workbook.sheet_by_index(0)

workbook2 = xlrd.open_workbook("Bell Schedule_.xlsx")
worksheet2 = workbook2.sheet_by_index(0)

#schedule = {date: [event, {start: [endtime, period name]}}
schedule = {}
for i in range(worksheet.nrows):
	for j in range(worksheet.ncols):
		s = " ".join(worksheet.cell_value(i, j).split()).replace("- ", "")
		date = s.split()[0]
		event = " ".join(s.split()[1:])
		# print(date, event)
		# print(date, event)
		schedule[date] = [event, {}]
# dictionary = {}
# for j in range(worksheet2.ncols):
# 	l = []
# 	for i in range(worksheet2.nrows):
# 		w = worksheet2.cell_value(i, j).split(" - ")
# 		if (w == ['']):
# 			continue
# 		if (len(w) == 1):
# 			l.append(w[0])
# 		else:
# 			l.append(w)
# 	dictionary[l[0]] = l[1:]
# print(dictionary)
scheds = {'HR': [['7:45', '8:10', 'Homeroom'],['8:15', '8:58', 'Period 1'], ['9:03', '9:46', 'Period 2'], ['9:51', '10:34', 'Period 3'], ['10:39', '11:22', 'Period 4'], ['11:22', '12:06', 'Lunch'], ['12:11', '12:54', 'Period 5'], ['12:59', '1:42', 'Period 6'], ['1:47', '2:30', 'Period 7'], ['2:40', '3:25', 'Period 8']], 'FT1': [['7:45', '8:52', 'Period 1'], ['8:57', '9:40', 'Period 2'], ['9:45', '10:28', 'Period 3'], ['10:33', '11:16', 'Period 4'], ['11:16', '12:06', 'Lunch'], ['12:11', '12:54', 'Period 5'], ['12:59', '1:42', 'Period 6'], ['1:47', '2:30', 'Period 7'], ['2:40', '3:25', 'Period 8']], 'FT2': [['7:45', '8:33', 'Period 1'], ['8:38', '9:40', 'Period 2'], ['9:45', '10:28', 'Period 3'], ['10:33', '11:16', 'Period 4'], ['11:16', '12:06', 'Lunch'], ['12:11', '12:54', 'Period 5'], ['12:59', '1:42', 'Period 6'], ['1:47', '2:30', 'Period 7'], ['2:40', '3:25', 'Period 8']], 'FT3': [['7:45', '8:33', 'Period 1'], ['8:38', '9:21', 'Period 2'], ['9:26', '10:28', 'Period 3'], ['10:33', '11:16', 'Period 4'], ['11:16', '12:06', 'Lunch'], ['12:11', '12:54', 'Period 5'], ['12:59', '1:42', 'Period 6'], ['1:47', '2:30', 'Period 7'], ['2:40', '3:25', 'Period 8']], 'FT4': [['7:45', '8:33', 'Period 1'], ['8:38', '9:21', 'Period 2'], ['9:26', '10:09', 'Period 3'], ['10:14', '11:16', 'Period 4'], ['11:16', '12:06', 'Lunch'], ['12:11', '12:54', 'Period 5'], ['12:59', '1:42', 'Period 6'], ['1:47', '2:30', 'Period 7'], ['2:40', '3:25', 'Period 8']], 'FT5': [['7:45', '8:33', 'Period 1'], ['8:38', '9:21', 'Period 2'], ['9:26', '10:09', 'Period 3'], ['10:14', '10:57', 'Period 4'], ['10:57', '11:47', 'Lunch'], ['11:52', '12:54', 'Period 5'], ['12:59', '1:42', 'Period 6'], ['1:47', '2:30', 'Period 7'], ['2:40', '3:25', 'Period 8']], 'FT6': [['7:45', '8:33', 'Period 1'], ['8:38', '9:21', 'Period 2'], ['9:26', '10:09', 'Period 3'], ['10:14', '10:57', 'Period 4'], ['10:57', '11:47', 'Lunch'], ['11:52', '12:35', 'Period 5'], ['12:40', '1:42', 'Period 6'], ['1:47', '2:30', 'Period 7'], ['2:40', '3:25', 'Period 8']], 'FT7': [['7:45', '8:33', 'Period 1'], ['8:38', '9:21', 'Period 2'], ['9:26', '10:09', 'Period 3'], ['10:14', '10:57', 'Period 4'], ['10:57', '11:47', 'Lunch'], ['11:52', '12:35', 'Period 5'], ['12:40', '1:23', 'Period 6'], ['1:28', '2:30', 'Period 7'], ['2:40', '3:25', 'Period 8']], 'Adv': [['7:45', '8:30', 'Period 1'], ['8:35', '9:17', 'Period 2'], ['9:22', '9:47', 'Advisory in Homeroom'], ['9:52', '10:34', 'Period 3'], ['10:39', '11:21', 'Period 4'], ['11:21', '12:09', 'Lunch'], ['12:14', '12:56', 'Period 5'], ['1:01', '1:43', 'Period 6'], ['1:48', '2:30', 'Period 7'], ['2:40', '3:25', 'Period 8']], 'Early': [['7:45', '8:11', 'Period 1'], ['8:17', '8:43', 'Period 2'], ['8:49', '9:15', 'Period 3'], ['9:21', '9:47', 'Period 4'], ['9:53', '10:19', 'Period 5'], ['10:25', '10:51', 'Period 6'], ['10:57', '11:23', 'Period 7'], ['11:23', '11:58', 'Lunch']]}

def turnNum(s):
	s = s.split(":")
	if (int(s[0]) <= 5):
		s[0] = int(s[0]) + 12
	return int(s[0])*60*60 + int(s[1])*60

noStudyHall = "9/2 9/23 10/21 11/4 12/22 1/13 2/17 3/30 4/20 5/26 6/9".split()

for data, event in schedule.items():
	key = ""
	for item in scheds:
		if (str(item) in str(event)):
			key = item
			break
	if ("No Adv." in str(event)):
		key = ""
	if key == "":
		for info in scheds["HR"]:
			schedule[data][1][turnNum(info[0])] = [turnNum(info[1]),  str(info[2])]

		schedule[data][0] += " (Showing Homeroom Schedule)"
		continue
	for info in scheds[key]:
		schedule[data][1][turnNum(info[0])] = [turnNum(info[1]), str(info[2])]
	
for data in schedule:
	if 52800 in schedule[data][1]:

		schedule[data][1][52620] = schedule[data][1][52800]
		del schedule[data][1][52800]
	
for data in noStudyHall:
	schedule[data][0] += " (No Eighth)"
	del schedule[data][1][max(schedule[data][1])]

schedule['base'] =['No School (Most Likely)', {0: [0, 'NONE']}]
with open('data.json', 'w') as data_file:
	data_file.write( json.dumps(schedule, indent = 2))
