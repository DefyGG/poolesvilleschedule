import json
 
 #make individual edits to data.json
def turnNum(s):
    s = s.split(":")
    if (int(s[0]) <= 5):
        s[0] = int(s[0]) + 12
    return int(s[0])*60*60 + int(s[1])*60


data = ""
with open('data.json') as json_file:
    data = json.load(json_file)
    schedule = open("EarlyRelease.txt", "r").readlines()
    date = schedule[0].strip()
    del schedule[0]
    event_name = schedule[0].strip()
    del schedule[0]
    data[date] = [event_name, {}]
    for i in range(len(schedule)):
        period = schedule[i].strip().split()
        name = period[0]
        if (len(period) > 2):
            name = name + " " + period[1]
        new_times = period[-1].split("-")
        start = turnNum(new_times[0])
        end = turnNum(new_times[1])
        data[date][1][start] = [end, name]
    # date = input("What date are we changing: ")
    # event_name = input("New event name: ")
    # data[date] = [event_name, {}]
    # while True:
    #     period = input("Enter Period Name: ")
    #     if (period == "done"):
    #         break
    #     new_times = input("Enter New Time Range: ").split("-")
    #     start = turnNum(new_times[0])
    #     end = turnNum(new_times[1])
    #     data[date][1][start] = [end, period] 

with open('data.json', 'w') as data_file:
    print("Writing Data...")
    data_file.write( json.dumps(data, indent = 2))
