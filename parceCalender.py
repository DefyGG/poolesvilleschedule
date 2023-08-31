import xlrd
import json
# import pyperclip
xlrd.xlsx.ensure_elementtree_imported(False, None)
xlrd.xlsx.Element_has_iter = True
workbook = xlrd.open_workbook("Cal_2.xlsx")
worksheet = workbook.sheet_by_index(0)

workbook2 = xlrd.open_workbook("Bell Schedule_.xlsx")
worksheet2 = workbook2.sheet_by_index(0)

# #schedule = {date: [event, {start: [endtime, period name]}}
schedule = {}
for i in range(worksheet.nrows):
	for j in range(worksheet.ncols):
		# print(worksheet.cell_value(i, j))
		if (worksheet.cell_value(i, j) == ""):
			continue
		s = " ".join(worksheet.cell_value(i, j).split()).replace("- ", "")
		# print(s)
		date = s.split()[0]
		event = " ".join(s.split()[1:]) 
		if (event == ""):
			event = "Normal Schedule"
		print(date, event)
		# # print(date, event)
		schedule[date] = [event, {}]


dictionary = {}
for j in range(worksheet2.ncols):
	l = []
	for i in range(worksheet2.nrows):
		w = worksheet2.cell_value(i, j)
		l.append(w)
	if ("" == l[0]):
		continue
	for i in range(len(l), -1, -1):
		if (l[i-1] == ""):
			l.pop(i-1)
		else:
			break
	event = l[0]
	l = l[1:]
	first_l = l[:len(l)//2]
	second_l = l[len(l)//2:]
	print(first_l, second_l)
	for i in range(len(second_l)):
		first_l[i] = first_l[i].split(" - ")
		first_l[i].append(second_l[i])
		# print(first_l[i])
		if (".0" in str(first_l[i][2])):
			first_l[i][2] = "Period " + str(int(first_l[i][2]))
	# print(first_l)
	dictionary[event] = first_l
	# dictionary[l[0]] = l[1:]
print(dictionary)
scheds = dictionary
def turnNum(s):
	s = s.split(":")
	if (int(s[0]) <= 5):
		s[0] = int(s[0]) + 12
	return int(s[0])*60*60 + int(s[1])*60

# noStudyHall = "9/2 9/23 10/21 11/4 12/22 1/13 2/17 3/30 4/20 5/26 6/9".split()

for data, event in schedule.items():
	key = ""
	for item in scheds:
		if (str(item) in str(event)):
			key = item
			break
	if ("No Adv." in str(event)):
		key = ""
	if key == "":
		for info in scheds["Normal Schedule"]:
			schedule[data][1][turnNum(info[0])] = [turnNum(info[1]),  str(info[2])]
		continue
	for info in scheds[key]:
		schedule[data][1][turnNum(info[0])] = [turnNum(info[1]), str(info[2])]
#Changing 2:40 to 2:37 has the start for 8th period (new update not reflected in updates)
for data in schedule:
	if 52800 in schedule[data][1]:
		schedule[data][1][52620] = schedule[data][1][52800]
		del schedule[data][1][52800]

print(schedule)
# #Removing 8th period for all classes
# for data in noStudyHall:
# 	schedule[data][0] += " (No Eighth)"
# 	del schedule[data][1][max(schedule[data][1])]

# #Adding FIT data to classes
# for data in schedule:
# 	if ("FT" in schedule[data][0]):
# 		# print(schedule[data][0])
# 		# found = False
# 		new_schedule = {}
# 		for time in schedule[data][1]:
# 			# print(schedule[data][1][time][0] - time )
# 			if schedule[data][1][time][0] - time >= 3720:
# 				new_schedule[time] = [schedule[data][1][time][0] - 19*60, schedule[data][1][time][1]]
# 				new_schedule[schedule[data][1][time][0] - 19*60] = [schedule[data][1][time][0], "FIT"]
# 				# print(schedule[data][0], schedule[data][1][time][1])
# 			else:
# 				new_schedule[time] = schedule[data][1][time]
# 		schedule[data][1] = new_schedule
# 		# print(found)
# 		# if (found == False):
# 		# 	print("broken")
# 		# 	exit(0)
		
# print("All working")

schedule['base'] =['No School (Most Likely)', {0: [0, 'NONE']}]
print("Finished processing")

with open('data.json', 'w') as data_file:
	print("Writing Data...")
	data_file.write( json.dumps(schedule, indent = 2))
