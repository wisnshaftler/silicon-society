using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Net.Http;
using System.Security.Principal;
using System.Text;
using System.Windows.Forms;
using System.Security.Cryptography;
using System.IO;
using System.Diagnostics;
using System.Collections.ObjectModel;
using System.Management;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using System.Net;

namespace SS_OFFICIAL
{
    public partial class Form1 : Form
    {
        //golabl email and password
        public string email, password, userID, globalURL;
        public JObject newProjects = new JObject();
        public JObject contributed = new JObject();

        public Form1()
        {
            InitializeComponent();
            ApiHelper.InitializeClient();
            globalURL = "http://127.0.0.1/";
        }

        private async void btnlogin_Click(object sender, EventArgs e)
        {
            lblStatus.Text = "Please wait....";
            email = txtemail.Text;
            password = txtpassword.Text;

            //hash the password 
            byte[] shaByte = SHA256.Create().ComputeHash(Encoding.UTF8.GetBytes(password));
            StringBuilder bulder = new StringBuilder();
            for (int i = 0; i < shaByte.Length; i++)
            {
                bulder.Append(shaByte[i].ToString("x2"));
            }
            bulder.ToString();

            //set password
            password = bulder.ToString();

            loginData logdata = new loginData();
            logdata.email = email;
            logdata.password = password;
            var jsonlogdata = JsonConvert.SerializeObject(logdata);
            StringContent data = new StringContent(jsonlogdata, Encoding.UTF8, "application/json");

            using (HttpResponseMessage response = await ApiHelper.ApiClient.PostAsync("login", data))
            {
                if (response.IsSuccessStatusCode)
                {
                    String result = await response.Content.ReadAsStringAsync();
                    JObject jsonReply = JObject.Parse(result);

                    String status = (string)jsonReply["status"];

                    if (status == "0")
                    {
                        MessageBox.Show("Email or password is incorrect", "Ops!!!", MessageBoxButtons.OK, MessageBoxIcon.Asterisk);
                        return;
                    }

                    JArray responseData = (JArray)jsonReply["data"];

                    //create folder for store defalts.
                    Directory.CreateDirectory(@"c:\silicon_society");
                    Directory.CreateDirectory(@"c:\silicon_society\software");
                    Directory.CreateDirectory(@"c:\silicon_society\storage");
                    cmdRun cmd = new cmdRun();

                    string uuid = await cmd.getCMD("wmic csproduct get uuid", 6);

                    uuidSearch uuidSearch = new uuidSearch();
                    uuidSearch.email = email;
                    uuidSearch.password = password;
                    uuidSearch.uuid = uuid.Trim();


                    var uuidSearchData = JsonConvert.SerializeObject(uuidSearch);
                    StringContent uuidPostData = new StringContent(uuidSearchData, Encoding.UTF8, "application/json");

                    using (HttpResponseMessage responses = await ApiHelper.ApiClient.PostAsync("uuidSearch", uuidPostData))
                    {
                        if (responses.IsSuccessStatusCode)
                        {
                            result = await responses.Content.ReadAsStringAsync();
                            jsonReply = JObject.Parse(result);

                            JArray status1 = (JArray)jsonReply["data"];

                            btnRegister.Enabled = false;
                            if (status1.Count == 0)
                            {
                                uuid = "";
                                btnRegister.Enabled = true;
                            }

                            userID = responseData[0]["_id"].ToString();

                            JObject defaultData = new JObject(
                                new JProperty("user_id", responseData[0]["_id"]),
                                new JProperty("user_email", email),
                                new JProperty("UUID", uuid.Trim())
                                );

                            File.WriteAllText(@"c:\silicon_society\defaultData.json", defaultData.ToString());
                            lblStatus.Text = "Sign in sucessfull";

                            MessageBox.Show("Sucess", "Sign in successfull", MessageBoxButtons.OK, MessageBoxIcon.Information);

                            
                            if (status1.Count == 0)
                            {
                                foreach(Control tbc in tabmain.Controls)
                                {
                                    if(tbc.Name != "tabDeviceReg")
                                    {
                                        tbc.Enabled = false;
                                    }
                                }
                                MessageBox.Show("This device is not regiresterd yet. Please register this device to continue. All other" +
                                    "features are available after this device registerd", "Attention", MessageBoxButtons.OK, MessageBoxIcon.Asterisk);
                            }
                            else
                            {
                                //start the project
                                getProject();
                                await Task.Delay(500);
                                getContributed();

                            }

                            logingrp.Visible = false;
                            tabmain.Visible = true;

                            status1 = null;
                            defaultData = null;
                        }
                    }
                    status = null;
                    data = null;
                    cmd = null;
                    result = null;
                    uuid = null;
                    bulder = null;
                }
            }
        }
        public class loginData
        {
            public String email { get; set; }
            public String password { get; set; }
        }

        private async void btnLoadDevice_Click(object sender, EventArgs e)
        {
            tabmain.UseWaitCursor = true;
            lblStatus.Text = "Processing...";

            cmdRun cmd = new cmdRun();

            string uuid = await cmd.getCMD("wmic csproduct get uuid", 6);

            uuidSearch uuidSearch = new uuidSearch();
            uuidSearch.email = email;
            uuidSearch.password = password;
            uuidSearch.uuid = uuid.Trim();

            string processorName = await cmd.getCMD("wmic cpu get name", 6);
            string[] processorSlice;
            if (processorName.Contains("AMD"))
            {
                processorSlice = processorName.Split(' ');
                processorName = processorSlice[1] + " " + processorSlice[2] + " " + processorSlice[3];
            }
            if (processorName.Contains("Intel"))
            {
                processorSlice = processorName.Split(' ');
                processorName = processorSlice[2];
            }

            processorSearch processorSearch = new processorSearch();
            processorSearch.email = email;
            processorSearch.password = password;
            processorSearch.processor = processorName.ToLower();

            var jsonlogdata = JsonConvert.SerializeObject(processorSearch);
            StringContent data = new StringContent(jsonlogdata, Encoding.UTF8, "application/json");

            try
            {
                using (HttpResponseMessage response = await ApiHelper.ApiClient.PostAsync("processorList", data))
                {
                    if (!response.IsSuccessStatusCode)
                    {
                        MessageBox.Show("Cant connect to server.Please try again.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        lblStatus.Text = "Error. Please try again";
                        return;
                    }
                    else
                    {
                        String result = await response.Content.ReadAsStringAsync();
                        JObject jsonReply = JObject.Parse(result);

                        string status = (string)jsonReply["status"];
                        if (status == "0")
                        {
                            string errorMessage = (string)jsonReply["msg"];
                            MessageBox.Show("Error: Server say :-" + errorMessage, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                            lblStatus.Text = "Welcome.";
                            return;
                        }
                        else
                        {
                            JArray processorArray = (JArray)jsonReply["data"];
                            foreach (JObject processor in processorArray)
                            {
                                cmbCPU.Items.Add(processor.GetValue("Processor").ToString());
                            }

                            string os = await cmd.getCMD("wmic os get name", 6);

                            os = os.ToString().Split('|')[0].ToString();

                            if (os.Contains("10"))
                            {
                                lblOS.Text = "windows 10";
                            }
                            else
                            if (os.Contains("7"))
                            {
                                lblOS.Text = "windows 7";
                            }
                            else
                           if (os.Contains("8"))
                            {
                                lblOS.Text = "windows 8";
                            }
                            else
                           if (os.Contains("11"))
                            {
                                lblOS.Text = "windows 11";
                            }
                            else
                            {
                                lblOS.Text = "windows xp";
                            }

                            runPowerShell powerShell = new runPowerShell();
                            List<string> ramSize=await powerShell.runCommand("Get-WmiObject -Class Win32_ComputerSystem | select TotalPhysicalMemory");
                            ulong ramValue = ulong.Parse( new Regex(@"\d+").Match(ramSize[0]).Value.Trim());
                            ramValue = (ramValue/2)/ 1000000000;
                            ramCapacity.Maximum = ramValue;

                            tabmain.UseWaitCursor = false;
                            lblStatus.Text = "Done";
                            MessageBox.Show("Done loading data. Please fill and press the register button", "Data loaded", MessageBoxButtons.OK, MessageBoxIcon.Information);
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                MessageBox.Show("Connection to server is interupted. Please try again", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                
            }

        }

        public class uuidSearch
        {
            public String uuid { get; set; }
            public String email { get; set; }
            public String password { get; set; }
        }

        private async void btnRegister_Click(object sender, EventArgs e)
        {
            try
            {
                tabmain.UseWaitCursor = true;

                if(txtpcname.Text.Trim() == "")
                {
                    MessageBox.Show("Cant be PC name empty.", "Dont keep empty fields", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    tabmain.UseWaitCursor = false;
                    return;
                }
                if(cmbCPU.SelectedIndex == -1)
                {
                    MessageBox.Show("Cant be PC processor empty.", "Dont keep empty fields", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    tabmain.UseWaitCursor = false;
                    return;
                }

                string pcname = txtpcname.Text;
                decimal network = networkCapacity.Value;
                decimal ram = ramCapacity.Value;
                decimal storage = storageCapacity.Value;
                string cpuName = cmbCPU.SelectedItem.ToString();
                string osName = lblOS.Text;

                if(network == 0|| ram == 0 || storage ==0)
                {
                    MessageBox.Show("Cant use 0 values.", "Dont keep invalid inputs", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    tabmain.UseWaitCursor = false;
                    return;
                }

                cmdRun cmd = new cmdRun();

                string uuid = await cmd.getCMD("wmic csproduct get uuid", 6);

                uuidSearch uuidSearch = new uuidSearch();
                uuidSearch.email = email;
                uuidSearch.password = password;
                uuidSearch.uuid = uuid.Trim();

                //creating object for send device registration data to server
                newDevice device = new newDevice();
                device.email = email;
                device.password = password;
                device.cpuName = cpuName;
                device.osName = osName;
                device.pcname = pcname;
                device.UUID = uuid.Trim();
                device.ram = ram;
                device.storage = storage;
                device.network = network;

                var jsonconvert = JsonConvert.SerializeObject(device);
                StringContent jasonData = new StringContent(jsonconvert, Encoding.UTF8, "application/json");

                using (HttpResponseMessage response = await ApiHelper.ApiClient.PutAsync("newDevice", jasonData))
                {
                    if (!response.IsSuccessStatusCode)
                    {
                        MessageBox.Show("Cant connect to server.Please try again.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        lblStatus.Text = "Error. Please try again";
                        tabmain.UseWaitCursor = false;
                        return;
                    }

                    String result = await response.Content.ReadAsStringAsync();
                    JObject jsonReply = JObject.Parse(result);

                    string status = (string)jsonReply["status"];

                    if(status == "0")
                    {
                        string errorMessage = (string)jsonReply["msg"];
                        MessageBox.Show("Error: Server say :-" + errorMessage, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        lblStatus.Text = "Welcome.";
                        tabmain.UseWaitCursor = false;
                        return;
                    }
                    if(status == "1")
                    {
                        JObject defaultData = new JObject(
                                new JProperty("user_id", userID),
                                new JProperty("user_email", email),
                                new JProperty("UUID", uuid.Trim())
                                );

                        File.WriteAllText(@"c:\silicon_society\defaultData.json", defaultData.ToString());

                        MessageBox.Show("Registration complete", "Done", MessageBoxButtons.OK, MessageBoxIcon.Information);
                        tabmain.UseWaitCursor = false;
                        foreach (Control tbc in tabmain.Controls)
                        {
                            tbc.Enabled = true;
                        }
                        return;
                    }
                    lblStatus.Text = "Successfully added this device";

                    foreach (Control tbc in tabmain.Controls)
                    {
                        tbc.Enabled = true;
                    }

                    tabmain.UseWaitCursor = false;
                    btnRegister.Enabled = false;

                }

            }
            catch (Exception ex)
            {
                MessageBox.Show("Connection to server is interupted. Please try again", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                tabmain.UseWaitCursor = false;
            }
        }

        public class processorSearch
        {
            public String email { get; set; }
            public String password { get; set; }
            public String processor { get; set; }
        }

        public async Task getProject()
        {
            try
            {
                cmdRun cmd = new cmdRun();

                string uuid = await cmd.getCMD("wmic csproduct get uuid", 6);
                
                JObject projectSearch = new JObject(
                    new JProperty("UUID", uuid.Trim()),
                    new JProperty("email", email),
                    new JProperty("password", password)
                    );

                var jsonconvert = JsonConvert.SerializeObject(projectSearch);
                StringContent jasonData = new StringContent(jsonconvert, Encoding.UTF8, "application/json");

                using (HttpResponseMessage response = await ApiHelper.ApiClient.PostAsync("projectSearch", jasonData))
                {
                    if (!response.IsSuccessStatusCode)
                    {
                        MessageBox.Show("Cant connect to server.Please try again.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        lblStatus.Text = "Error. Please try again";
                        tabmain.UseWaitCursor = false;
                        return;
                    }
                    //get all project data
                    String result = await response.Content.ReadAsStringAsync();
                    JObject jsonReply = JObject.Parse(result);

                    string status = (string)jsonReply["status"];
                    if (status == "0")
                    {
                        string errorMessage = (string)jsonReply["msg"];
                        MessageBox.Show("Error: Server say :-" + errorMessage, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        lblStatus.Text = "Welcome.";
                        return;
                    }
                    JArray projectList = (JArray)jsonReply["data"];
                    if(projectList.Count == 0)
                    {
                        MessageBox.Show("Currently there are no projects that match with your system specifications", "OOPS no projects", MessageBoxButtons.OK
                            , MessageBoxIcon.Information);
                        lblProjectWait.Visible = false;
                        return;
                    }
                    
                    //get all projects and add to the project list box
                    foreach(JObject project in projectList)
                    {
                        newProjects[project.GetValue("_id").ToString()] = project;

                        string[] listItems = {project.GetValue("_id").ToString(), project.GetValue("name").ToString(),
                  project.GetValue("leastRAM").ToString()};

                        lstNewProject.Items.Add(new ListViewItem(listItems));
                        listItems = null;
                    }
                    lblProjectWait.Visible = false;
                    lstNewProject.Visible = true;
                    grpViewProject.Visible = true;

                    lstNewProject.MultiSelect = false;
                    //please enter here messagebox that contains project details
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Something went wrong. Please try again");
                lblProjectWait.Visible = false;
            }
        }
        private void tabPage2_Click(object sender, EventArgs e)
        {

        }

        private void lblProjectWait_Click(object sender, EventArgs e)
        {

        }

        private async void button1_Click(object sender, EventArgs e)
        {
            try
            {
                string selectedProject = lstNewProject.SelectedItems[0].Text;
                cmdRun cmd = new cmdRun();
                string uuid = await cmd.getCMD("wmic csproduct get uuid", 6);
                uuidSearch uuidSearch = new uuidSearch();
                uuidSearch.email = email;
                uuidSearch.password = password;
                uuidSearch.uuid = uuid.Trim();

                JObject projectSearch = new JObject(
                    new JProperty("UUID", uuid),
                    new JProperty("email", email),
                    new JProperty("password", password),
                    new JProperty("selectedProject", selectedProject)
                    );

                var jsonconvert = JsonConvert.SerializeObject(projectSearch);
                StringContent jasonData = new StringContent(jsonconvert, Encoding.UTF8, "application/json");
                using (HttpResponseMessage response = await ApiHelper.ApiClient.PutAsync("newContribute", jasonData))
                {
                    if (!response.IsSuccessStatusCode)
                    {
                        MessageBox.Show("Cant connect to server.Please try again.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        lblStatus.Text = "Error. Please try again";
                        tabmain.UseWaitCursor = false;
                        return;
                    }
                    //get all project data
                    String result = await response.Content.ReadAsStringAsync();
                    JObject jsonReply = JObject.Parse(result);

                    string status = (string)jsonReply["status"];
                    if (status == "0")
                    {
                        string errorMessage = (string)jsonReply["msg"];
                        MessageBox.Show("Error: Server say :-" + errorMessage, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        lblStatus.Text = "Welcome.";
                        return;
                    }
                    if(status == "1")
                    {
                        lblStatus.Text = "Server sent success status. Downloading client software.";
                        //copy the file to system folder
                        JObject selectedProjectData = (JObject)newProjects.GetValue(lstNewProject.SelectedItems[0].Text);
                        JArray softwareID = (JArray)selectedProjectData.GetValue("softwareID");
                        string softwareName = "";
                        foreach (string name in softwareID)
                        {
                            if (name.Contains(".exe"))
                            {
                                softwareName = name;
                            }
                        }
                        WebClient downloadClient = new WebClient();
                        
                        downloadClient.DownloadFile(new Uri (globalURL + "software/" + softwareName), @"c:\silicon_society\software\" + softwareName);
                        
                        MessageBox.Show("Successfully contributed to project","Done", MessageBoxButtons.OK, MessageBoxIcon.Information);
                        lblStatus.Text = "Sucessfully contributed";
                        lblStatus.Text = "Contribution successfull";

                        Process process = new Process();
                        process.StartInfo.UseShellExecute = false;
                        process.StartInfo.FileName = @"c:\silicon_society\software\" + softwareName;
                        process.StartInfo.Verb = "runas";
                        process.StartInfo.CreateNoWindow = false;
                        process.Start();
                        lblStatus.Text = "Sent the command to downloaded client to run";
                    }
                }
                //clear the projet lsit
                await clearProjectList();
                //load project again
                getProject();

            }
            catch (Exception ex)
            {
                MessageBox.Show("Something went wrong. Please try again");
            }
        }

        public async Task getContributed()
        {
            try
            {
                cmdRun uuidcmd = new cmdRun();

                string uu_id = await uuidcmd.getCMD("wmic csproduct get uuid", 6);

                JObject projectSearch = new JObject(
                    new JProperty("UUID", uu_id.Trim()),
                    new JProperty("email", email),
                    new JProperty("password", password)
                    );

                var jsonconvert = JsonConvert.SerializeObject(projectSearch);
                StringContent jasonData = new StringContent(jsonconvert, Encoding.UTF8, "application/json");

                using (HttpResponseMessage response = await ApiHelper.ApiClient.PostAsync("contributed", jasonData))
                {
                    if (!response.IsSuccessStatusCode)
                    {
                        MessageBox.Show("Cant connect to server.Please try again.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        lblStatus.Text = "Error. Please try again";
                        tabmain.UseWaitCursor = false;
                        return;
                    }
                    //get all project data
                    String result = await response.Content.ReadAsStringAsync();
                    JObject jsonReply = JObject.Parse(result);

                    string status = (string)jsonReply["status"];
                    if (status == "0")
                    {
                        string errorMessage = (string)jsonReply["msg"];
                        MessageBox.Show("Error: Server say :-" + errorMessage, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        lblStatus.Text = "Welcome.";
                        return;
                    }
                    JArray resultData = (JArray)jsonReply["data"];
                    
                    if (status == "1" && resultData.Count ==0)
                    {
                        MessageBox.Show("There are no projects contributed using this device", "No devices", MessageBoxButtons.OK, MessageBoxIcon.Information);
                        lblStatus.Text = "No projects contributed using this device";
                       
                        lblLoadingContributed.Visible = false;
                        lstContributed.Visible = true;
                        lstContributed.MultiSelect = false;
                        grpContributed.Visible = true;

                        lblStatus.Text = "All set. Ready to go.";
                        return;
                    }
                    foreach(JObject prj in resultData)
                    {
                        contributed[prj.GetValue("_id").ToString()] = prj;
                        string[] listItems = {prj.GetValue("_id").ToString(), prj.GetValue("name").ToString()};

                        lstContributed.Items.Add(new ListViewItem(listItems));
                        listItems = null;
                    }
                    
                    lblLoadingContributed.Visible = false;
                    lstContributed.Visible = true;
                    lstContributed.MultiSelect = false;
                    grpContributed.Visible = true;

                    lblStatus.Text = "All set. Ready to go.";
                }
            }
            catch (Exception ex)
            {

            }
            
        }

        private async void lstNewProject_SelectedIndexChanged(object sender, EventArgs e)
        {
            try
            {
                JObject selectedProject = (JObject)newProjects.GetValue(lstNewProject.SelectedItems[0].Text);
                lblOwnerID.Text = "Owner ID "+ selectedProject.GetValue("createdBy").ToString();
                lblSeparateTask.Text = "Seperate Task " + selectedProject.GetValue("separateTask").ToString();
                lblNeedDevice.Text = "Total Device Need " + selectedProject.GetValue("needDeviceCount").ToString();
                lblSoftwareID.Text = "Software ID " + selectedProject.GetValue("softwareID")[0].ToString();
                lblProjectDescription.Text = selectedProject.GetValue("description").ToString();
                prjIMG.ImageLocation = globalURL + selectedProject.GetValue("img").ToString();
                prjIMG.SizeMode = PictureBoxSizeMode.StretchImage;
            }
            catch(Exception ex)
            {
              
            }
        }

        private async void btnNewProjectRefresh_Click(object sender, EventArgs e)
        {
            await clearProjectList();
            getProject();
        }

        private void btnNewProjectHelp_Click(object sender, EventArgs e)
        {
            MessageBox.Show("In this location, you can see the projects that you can run this computer. \n\n" +
                "In the left side list view, you can see the brief details of the available projects. \n\n" +
                "In the right side, you can see the project details area, \n\n" +
                "After loading all the project details, you can select from the left side listbox by clicking on the item. \n\n" +
                "Once you click on the item, the right side boxes are fill with the selected project data. \n\n" +
                "If you like to contribute the selected project, click on the contribute button.\n\n" +
                "Using refresh button you can refresh the project listbox and you can load the new projects",
                "Help for contribute to new project", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }

        private void lstContributed_SelectedIndexChanged(object sender, EventArgs e)
        {
            try
            {
                JObject selectedProject = (JObject)contributed.GetValue(lstContributed.SelectedItems[0].Text);
                lblContriCreatedBy.Text = "Created By " + selectedProject.GetValue("createdBy").ToString();
                lblContriRAM.Text = "Total RAM " + selectedProject.GetValue("leastRAM").ToString();
                lblContriStatus.Text = "Status " + selectedProject.GetValue("status").ToString();
                lblContriOS.Text = "OS " + selectedProject.GetValue("os").ToString();
                lblContriSeparate.Text = " Separate Task" + selectedProject.GetValue("separateTask").ToString();
                lblSoftID.Text = "Software " + selectedProject.GetValue("softwareID")[0].ToString();
                lblContriDesc.Text = selectedProject.GetValue("description").ToString();
                contriImg.ImageLocation = globalURL + selectedProject.GetValue("img").ToString();
                contriImg.SizeMode = PictureBoxSizeMode.StretchImage;

            }
            catch (Exception ex)
            {

            }
        }

        private async void btnContriRefresh_Click(object sender, EventArgs e)
        {
            lblContriCreatedBy.Text = "Created By ";
            lblContriRAM.Text = "Total RAM " ;
            lblContriStatus.Text = "Status " ;
            lblContriOS.Text = "OS " ;
            lblContriSeparate.Text = " Separate Task" ;
            lblSoftID.Text = "Software " ;
            lblContriDesc.Text = "";
            contriImg.ImageLocation = null;
            lstContributed.Items.Clear();

            lblLoadingContributed.Visible = true;
            lstContributed.Visible = false;
            grpContributed.Visible = false;

            lstContributed.MultiSelect = false;

            await getContributed();
            MessageBox.Show("Ready to go.", "DONE", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }

        private async void btnLeveContributions_Click(object sender, EventArgs e)
        {
            try
            {
                string selectedProject = lstContributed.SelectedItems[0].Text;
                cmdRun cmd = new cmdRun();
                string uuid = await cmd.getCMD("wmic csproduct get uuid", 6);
                uuidSearch uuidSearch = new uuidSearch();
                uuidSearch.email = email;
                uuidSearch.password = password;
                uuidSearch.uuid = uuid.Trim();

                JObject projectSearch = new JObject(
                    new JProperty("UUID", uuid),
                    new JProperty("email", email),
                    new JProperty("password", password),
                    new JProperty("selectedProject", selectedProject)
                    );

                var jsonconvert = JsonConvert.SerializeObject(projectSearch);
                StringContent jasonData = new StringContent(jsonconvert, Encoding.UTF8, "application/json");

                using (HttpResponseMessage response = await ApiHelper.ApiClient.PostAsync("leaveContribute", jasonData))
                {
                    if (!response.IsSuccessStatusCode)
                    {
                        MessageBox.Show("Cant connect to server.Please try again.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        lblStatus.Text = "Error. Please try again";
                        tabmain.UseWaitCursor = false;
                        return;
                    }
                    //get all project data
                    String result = await response.Content.ReadAsStringAsync();
                    JObject jsonReply = JObject.Parse(result);

                    string status = (string)jsonReply["status"];
                    if (status == "0")
                    {
                        string errorMessage = (string)jsonReply["msg"];
                        MessageBox.Show("Error: Server say :-" + errorMessage, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        lblStatus.Text = "Welcome.";
                        return;
                    }
                    if(status == "1")
                    {
                        MessageBox.Show("You successfully leave from this project", "Done", MessageBoxButtons.OK, MessageBoxIcon.Information);
                        lblStatus.Text = "Successfully unsubcribe this project " + selectedProject;
                    }
                }
                getContributed();
            }
            catch
            {
                MessageBox.Show("Something went wrong. Please make sure your doing right things", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            ToolTip toolTip = new ToolTip();

            toolTip.AutoPopDelay = 5000;
            toolTip.InitialDelay = 1000;
            toolTip.ReshowDelay = 500;

            toolTip.ShowAlways = true;
            toolTip.SetToolTip(this.btnLeveContributions, "By clicking on this, you removet his device from selected project");
        }
        public async Task clearProjectList()
        {
            lstNewProject.Items.Clear();
            prjIMG.Image = null;
            lblOwnerID.Text = "Owner ID ";
            lblSeparateTask.Text = "Seperate Task ";
            lblNeedDevice.Text = "Total Device Need ";
            lblSoftwareID.Text = "Software ID ";
            lblProjectDescription.Text = "";

            lblProjectWait.Visible = true;
            lstNewProject.Visible = false;
            grpViewProject.Visible = false;

            lstNewProject.MultiSelect = false;
        }

        public class newDevice
        {
            public String email { get; set; }
            public String password { get; set; }
            public String pcname { get; set; }
            public String cpuName { get; set; }
            public String osName { get; set; }
            public String UUID { get; set; }
            public decimal network { get; set; }
            public decimal ram { get; set; }
            public decimal storage { get; set; }
            

        }
        
    }
}
