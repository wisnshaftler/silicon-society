
namespace SS_OFFICIAL
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Form1));
            this.statusStrip1 = new System.Windows.Forms.StatusStrip();
            this.lblStatus = new System.Windows.Forms.ToolStripStatusLabel();
            this.tabmain = new System.Windows.Forms.TabControl();
            this.tabProject = new System.Windows.Forms.TabPage();
            this.btnNewProjectHelp = new System.Windows.Forms.Button();
            this.btnNewProjectRefresh = new System.Windows.Forms.Button();
            this.lblProjectWait = new System.Windows.Forms.Label();
            this.grpViewProject = new System.Windows.Forms.GroupBox();
            this.btnContribute = new System.Windows.Forms.Button();
            this.lblSoftwareID = new System.Windows.Forms.Label();
            this.lblNeedDevice = new System.Windows.Forms.Label();
            this.lblSeparateTask = new System.Windows.Forms.Label();
            this.lblOwnerID = new System.Windows.Forms.Label();
            this.lblProjectDescription = new System.Windows.Forms.Label();
            this.label12 = new System.Windows.Forms.Label();
            this.prjIMG = new System.Windows.Forms.PictureBox();
            this.lstNewProject = new System.Windows.Forms.ListView();
            this.prjID = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.prjName = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.prjRAM = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.label11 = new System.Windows.Forms.Label();
            this.tabContributed = new System.Windows.Forms.TabPage();
            this.lblLoadingContributed = new System.Windows.Forms.Label();
            this.grpContributed = new System.Windows.Forms.GroupBox();
            this.btnContriRefresh = new System.Windows.Forms.Button();
            this.btnLeveContributions = new System.Windows.Forms.Button();
            this.lblContriDesc = new System.Windows.Forms.Label();
            this.label14 = new System.Windows.Forms.Label();
            this.lblSoftID = new System.Windows.Forms.Label();
            this.lblContriSeparate = new System.Windows.Forms.Label();
            this.lblContriOS = new System.Windows.Forms.Label();
            this.lblContriStatus = new System.Windows.Forms.Label();
            this.lblContriRAM = new System.Windows.Forms.Label();
            this.lblContriCreatedBy = new System.Windows.Forms.Label();
            this.contriImg = new System.Windows.Forms.PictureBox();
            this.lstContributed = new System.Windows.Forms.ListView();
            this.contriPrjID = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.contriPrjName = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.label13 = new System.Windows.Forms.Label();
            this.tabDeviceReg = new System.Windows.Forms.TabPage();
            this.label10 = new System.Windows.Forms.Label();
            this.btnRegister = new System.Windows.Forms.Button();
            this.txtpcname = new System.Windows.Forms.TextBox();
            this.label9 = new System.Windows.Forms.Label();
            this.storageCapacity = new System.Windows.Forms.NumericUpDown();
            this.label8 = new System.Windows.Forms.Label();
            this.networkCapacity = new System.Windows.Forms.NumericUpDown();
            this.label7 = new System.Windows.Forms.Label();
            this.cmbCPU = new System.Windows.Forms.ComboBox();
            this.label6 = new System.Windows.Forms.Label();
            this.btnLoadDevice = new System.Windows.Forms.Button();
            this.ramCapacity = new System.Windows.Forms.NumericUpDown();
            this.label5 = new System.Windows.Forms.Label();
            this.lblOS = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.logingrp = new System.Windows.Forms.GroupBox();
            this.btnlogin = new System.Windows.Forms.Button();
            this.txtpassword = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.txtemail = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.statusStrip1.SuspendLayout();
            this.tabmain.SuspendLayout();
            this.tabProject.SuspendLayout();
            this.grpViewProject.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.prjIMG)).BeginInit();
            this.tabContributed.SuspendLayout();
            this.grpContributed.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.contriImg)).BeginInit();
            this.tabDeviceReg.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.storageCapacity)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.networkCapacity)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.ramCapacity)).BeginInit();
            this.logingrp.SuspendLayout();
            this.SuspendLayout();
            // 
            // statusStrip1
            // 
            this.statusStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.lblStatus});
            this.statusStrip1.Location = new System.Drawing.Point(0, 513);
            this.statusStrip1.Name = "statusStrip1";
            this.statusStrip1.Size = new System.Drawing.Size(1057, 22);
            this.statusStrip1.TabIndex = 0;
            this.statusStrip1.Text = "statusStrip1";
            // 
            // lblStatus
            // 
            this.lblStatus.Name = "lblStatus";
            this.lblStatus.Size = new System.Drawing.Size(57, 17);
            this.lblStatus.Text = "Welcome";
            // 
            // tabmain
            // 
            this.tabmain.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.tabmain.Controls.Add(this.tabProject);
            this.tabmain.Controls.Add(this.tabContributed);
            this.tabmain.Controls.Add(this.tabDeviceReg);
            this.tabmain.Location = new System.Drawing.Point(12, 12);
            this.tabmain.Name = "tabmain";
            this.tabmain.SelectedIndex = 0;
            this.tabmain.Size = new System.Drawing.Size(1045, 498);
            this.tabmain.TabIndex = 1;
            this.tabmain.Visible = false;
            // 
            // tabProject
            // 
            this.tabProject.AutoScroll = true;
            this.tabProject.Controls.Add(this.btnNewProjectHelp);
            this.tabProject.Controls.Add(this.btnNewProjectRefresh);
            this.tabProject.Controls.Add(this.lblProjectWait);
            this.tabProject.Controls.Add(this.grpViewProject);
            this.tabProject.Controls.Add(this.lstNewProject);
            this.tabProject.Controls.Add(this.label11);
            this.tabProject.Location = new System.Drawing.Point(4, 22);
            this.tabProject.Name = "tabProject";
            this.tabProject.Padding = new System.Windows.Forms.Padding(3);
            this.tabProject.Size = new System.Drawing.Size(1037, 472);
            this.tabProject.TabIndex = 1;
            this.tabProject.Text = "Projects";
            this.tabProject.UseVisualStyleBackColor = true;
            this.tabProject.Click += new System.EventHandler(this.tabPage2_Click);
            // 
            // btnNewProjectHelp
            // 
            this.btnNewProjectHelp.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnNewProjectHelp.Font = new System.Drawing.Font("Calibri", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnNewProjectHelp.Location = new System.Drawing.Point(903, 19);
            this.btnNewProjectHelp.Name = "btnNewProjectHelp";
            this.btnNewProjectHelp.Size = new System.Drawing.Size(87, 36);
            this.btnNewProjectHelp.TabIndex = 5;
            this.btnNewProjectHelp.Text = "How To Use";
            this.btnNewProjectHelp.UseVisualStyleBackColor = true;
            this.btnNewProjectHelp.Click += new System.EventHandler(this.btnNewProjectHelp_Click);
            // 
            // btnNewProjectRefresh
            // 
            this.btnNewProjectRefresh.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnNewProjectRefresh.Font = new System.Drawing.Font("Calibri", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnNewProjectRefresh.Location = new System.Drawing.Point(789, 19);
            this.btnNewProjectRefresh.Name = "btnNewProjectRefresh";
            this.btnNewProjectRefresh.Size = new System.Drawing.Size(87, 36);
            this.btnNewProjectRefresh.TabIndex = 4;
            this.btnNewProjectRefresh.Text = "Refresh";
            this.btnNewProjectRefresh.UseVisualStyleBackColor = true;
            this.btnNewProjectRefresh.Click += new System.EventHandler(this.btnNewProjectRefresh_Click);
            // 
            // lblProjectWait
            // 
            this.lblProjectWait.AutoSize = true;
            this.lblProjectWait.Font = new System.Drawing.Font("Microsoft Sans Serif", 20.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblProjectWait.Location = new System.Drawing.Point(372, 202);
            this.lblProjectWait.Name = "lblProjectWait";
            this.lblProjectWait.Size = new System.Drawing.Size(193, 31);
            this.lblProjectWait.TabIndex = 2;
            this.lblProjectWait.Text = "Please wait.....";
            this.lblProjectWait.Click += new System.EventHandler(this.lblProjectWait_Click);
            // 
            // grpViewProject
            // 
            this.grpViewProject.Controls.Add(this.btnContribute);
            this.grpViewProject.Controls.Add(this.lblSoftwareID);
            this.grpViewProject.Controls.Add(this.lblNeedDevice);
            this.grpViewProject.Controls.Add(this.lblSeparateTask);
            this.grpViewProject.Controls.Add(this.lblOwnerID);
            this.grpViewProject.Controls.Add(this.lblProjectDescription);
            this.grpViewProject.Controls.Add(this.label12);
            this.grpViewProject.Controls.Add(this.prjIMG);
            this.grpViewProject.Location = new System.Drawing.Point(518, 61);
            this.grpViewProject.Name = "grpViewProject";
            this.grpViewProject.Size = new System.Drawing.Size(511, 405);
            this.grpViewProject.TabIndex = 3;
            this.grpViewProject.TabStop = false;
            this.grpViewProject.Visible = false;
            // 
            // btnContribute
            // 
            this.btnContribute.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnContribute.Font = new System.Drawing.Font("Calibri", 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnContribute.Location = new System.Drawing.Point(331, 56);
            this.btnContribute.Name = "btnContribute";
            this.btnContribute.Size = new System.Drawing.Size(141, 41);
            this.btnContribute.TabIndex = 8;
            this.btnContribute.Text = "Contribute";
            this.btnContribute.UseVisualStyleBackColor = true;
            this.btnContribute.Click += new System.EventHandler(this.button1_Click);
            // 
            // lblSoftwareID
            // 
            this.lblSoftwareID.AutoSize = true;
            this.lblSoftwareID.Font = new System.Drawing.Font("Microsoft Sans Serif", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblSoftwareID.Location = new System.Drawing.Point(6, 369);
            this.lblSoftwareID.Name = "lblSoftwareID";
            this.lblSoftwareID.Size = new System.Drawing.Size(85, 18);
            this.lblSoftwareID.TabIndex = 7;
            this.lblSoftwareID.Text = "Software ID";
            // 
            // lblNeedDevice
            // 
            this.lblNeedDevice.AutoSize = true;
            this.lblNeedDevice.Font = new System.Drawing.Font("Microsoft Sans Serif", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblNeedDevice.Location = new System.Drawing.Point(6, 329);
            this.lblNeedDevice.Name = "lblNeedDevice";
            this.lblNeedDevice.Size = new System.Drawing.Size(145, 18);
            this.lblNeedDevice.TabIndex = 6;
            this.lblNeedDevice.Text = "Total Device Needed";
            // 
            // lblSeparateTask
            // 
            this.lblSeparateTask.AutoSize = true;
            this.lblSeparateTask.Font = new System.Drawing.Font("Microsoft Sans Serif", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblSeparateTask.Location = new System.Drawing.Point(302, 282);
            this.lblSeparateTask.Name = "lblSeparateTask";
            this.lblSeparateTask.Size = new System.Drawing.Size(104, 18);
            this.lblSeparateTask.TabIndex = 5;
            this.lblSeparateTask.Text = "Separate Task";
            // 
            // lblOwnerID
            // 
            this.lblOwnerID.AutoSize = true;
            this.lblOwnerID.Font = new System.Drawing.Font("Microsoft Sans Serif", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblOwnerID.Location = new System.Drawing.Point(6, 282);
            this.lblOwnerID.Name = "lblOwnerID";
            this.lblOwnerID.Size = new System.Drawing.Size(70, 18);
            this.lblOwnerID.TabIndex = 4;
            this.lblOwnerID.Text = "Owner ID";
            // 
            // lblProjectDescription
            // 
            this.lblProjectDescription.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.lblProjectDescription.Font = new System.Drawing.Font("Microsoft Sans Serif", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblProjectDescription.Location = new System.Drawing.Point(6, 186);
            this.lblProjectDescription.Name = "lblProjectDescription";
            this.lblProjectDescription.Size = new System.Drawing.Size(499, 86);
            this.lblProjectDescription.TabIndex = 3;
            // 
            // label12
            // 
            this.label12.AutoSize = true;
            this.label12.Font = new System.Drawing.Font("Microsoft Sans Serif", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label12.Location = new System.Drawing.Point(6, 154);
            this.label12.Name = "label12";
            this.label12.Size = new System.Drawing.Size(134, 18);
            this.label12.TabIndex = 2;
            this.label12.Text = "Project Description";
            // 
            // prjIMG
            // 
            this.prjIMG.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.prjIMG.Location = new System.Drawing.Point(146, 19);
            this.prjIMG.Name = "prjIMG";
            this.prjIMG.Size = new System.Drawing.Size(150, 150);
            this.prjIMG.TabIndex = 0;
            this.prjIMG.TabStop = false;
            // 
            // lstNewProject
            // 
            this.lstNewProject.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.prjID,
            this.prjName,
            this.prjRAM});
            this.lstNewProject.Font = new System.Drawing.Font("Microsoft Sans Serif", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lstNewProject.HideSelection = false;
            this.lstNewProject.Location = new System.Drawing.Point(6, 61);
            this.lstNewProject.Name = "lstNewProject";
            this.lstNewProject.Size = new System.Drawing.Size(506, 405);
            this.lstNewProject.TabIndex = 1;
            this.lstNewProject.UseCompatibleStateImageBehavior = false;
            this.lstNewProject.View = System.Windows.Forms.View.Details;
            this.lstNewProject.Visible = false;
            this.lstNewProject.SelectedIndexChanged += new System.EventHandler(this.lstNewProject_SelectedIndexChanged);
            // 
            // prjID
            // 
            this.prjID.Text = "ID";
            this.prjID.Width = 186;
            // 
            // prjName
            // 
            this.prjName.Text = "Name";
            this.prjName.Width = 229;
            // 
            // prjRAM
            // 
            this.prjRAM.Text = "RAM(GB)";
            this.prjRAM.Width = 84;
            // 
            // label11
            // 
            this.label11.AutoSize = true;
            this.label11.BackColor = System.Drawing.Color.WhiteSmoke;
            this.label11.Font = new System.Drawing.Font("Calibri", 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label11.Location = new System.Drawing.Point(258, 19);
            this.label11.Name = "label11";
            this.label11.Size = new System.Drawing.Size(399, 23);
            this.label11.TabIndex = 0;
            this.label11.Text = "Here you can see projects thats you can contribute";
            // 
            // tabContributed
            // 
            this.tabContributed.Controls.Add(this.lblLoadingContributed);
            this.tabContributed.Controls.Add(this.grpContributed);
            this.tabContributed.Controls.Add(this.lstContributed);
            this.tabContributed.Controls.Add(this.label13);
            this.tabContributed.Location = new System.Drawing.Point(4, 22);
            this.tabContributed.Name = "tabContributed";
            this.tabContributed.Size = new System.Drawing.Size(1037, 472);
            this.tabContributed.TabIndex = 2;
            this.tabContributed.Text = "Contributed Projects";
            this.tabContributed.UseVisualStyleBackColor = true;
            // 
            // lblLoadingContributed
            // 
            this.lblLoadingContributed.AutoSize = true;
            this.lblLoadingContributed.Font = new System.Drawing.Font("Calibri", 21.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblLoadingContributed.Location = new System.Drawing.Point(345, 211);
            this.lblLoadingContributed.Name = "lblLoadingContributed";
            this.lblLoadingContributed.Size = new System.Drawing.Size(142, 36);
            this.lblLoadingContributed.TabIndex = 4;
            this.lblLoadingContributed.Text = "Loading.....";
            // 
            // grpContributed
            // 
            this.grpContributed.Controls.Add(this.btnContriRefresh);
            this.grpContributed.Controls.Add(this.btnLeveContributions);
            this.grpContributed.Controls.Add(this.lblContriDesc);
            this.grpContributed.Controls.Add(this.label14);
            this.grpContributed.Controls.Add(this.lblSoftID);
            this.grpContributed.Controls.Add(this.lblContriSeparate);
            this.grpContributed.Controls.Add(this.lblContriOS);
            this.grpContributed.Controls.Add(this.lblContriStatus);
            this.grpContributed.Controls.Add(this.lblContriRAM);
            this.grpContributed.Controls.Add(this.lblContriCreatedBy);
            this.grpContributed.Controls.Add(this.contriImg);
            this.grpContributed.Location = new System.Drawing.Point(430, 61);
            this.grpContributed.Name = "grpContributed";
            this.grpContributed.Size = new System.Drawing.Size(599, 408);
            this.grpContributed.TabIndex = 5;
            this.grpContributed.TabStop = false;
            this.grpContributed.Visible = false;
            // 
            // btnContriRefresh
            // 
            this.btnContriRefresh.Font = new System.Drawing.Font("Calibri", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnContriRefresh.Location = new System.Drawing.Point(306, 362);
            this.btnContriRefresh.Name = "btnContriRefresh";
            this.btnContriRefresh.Size = new System.Drawing.Size(125, 40);
            this.btnContriRefresh.TabIndex = 2;
            this.btnContriRefresh.Text = "Refresh";
            this.btnContriRefresh.UseVisualStyleBackColor = true;
            this.btnContriRefresh.Click += new System.EventHandler(this.btnContriRefresh_Click);
            // 
            // btnLeveContributions
            // 
            this.btnLeveContributions.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnLeveContributions.Font = new System.Drawing.Font("Calibri", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnLeveContributions.Location = new System.Drawing.Point(98, 362);
            this.btnLeveContributions.Name = "btnLeveContributions";
            this.btnLeveContributions.Size = new System.Drawing.Size(125, 40);
            this.btnLeveContributions.TabIndex = 1;
            this.btnLeveContributions.Text = "Leve from this.";
            this.btnLeveContributions.UseVisualStyleBackColor = true;
            this.btnLeveContributions.Click += new System.EventHandler(this.btnLeveContributions_Click);
            // 
            // lblContriDesc
            // 
            this.lblContriDesc.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.lblContriDesc.Font = new System.Drawing.Font("Calibri", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblContriDesc.Location = new System.Drawing.Point(6, 222);
            this.lblContriDesc.Name = "lblContriDesc";
            this.lblContriDesc.Size = new System.Drawing.Size(587, 130);
            this.lblContriDesc.TabIndex = 11;
            // 
            // label14
            // 
            this.label14.AutoSize = true;
            this.label14.Font = new System.Drawing.Font("Calibri", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label14.Location = new System.Drawing.Point(6, 187);
            this.label14.Name = "label14";
            this.label14.Size = new System.Drawing.Size(78, 18);
            this.label14.TabIndex = 10;
            this.label14.Text = "Description";
            // 
            // lblSoftID
            // 
            this.lblSoftID.AutoSize = true;
            this.lblSoftID.Font = new System.Drawing.Font("Calibri", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblSoftID.Location = new System.Drawing.Point(6, 117);
            this.lblSoftID.Name = "lblSoftID";
            this.lblSoftID.Size = new System.Drawing.Size(63, 18);
            this.lblSoftID.TabIndex = 9;
            this.lblSoftID.Text = "Software";
            // 
            // lblContriSeparate
            // 
            this.lblContriSeparate.AutoSize = true;
            this.lblContriSeparate.Font = new System.Drawing.Font("Calibri", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblContriSeparate.Location = new System.Drawing.Point(291, 77);
            this.lblContriSeparate.Name = "lblContriSeparate";
            this.lblContriSeparate.Size = new System.Drawing.Size(92, 18);
            this.lblContriSeparate.TabIndex = 8;
            this.lblContriSeparate.Text = "Separate Task";
            // 
            // lblContriOS
            // 
            this.lblContriOS.AutoSize = true;
            this.lblContriOS.Font = new System.Drawing.Font("Calibri", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblContriOS.Location = new System.Drawing.Point(291, 19);
            this.lblContriOS.Name = "lblContriOS";
            this.lblContriOS.Size = new System.Drawing.Size(25, 18);
            this.lblContriOS.TabIndex = 7;
            this.lblContriOS.Text = "OS";
            // 
            // lblContriStatus
            // 
            this.lblContriStatus.AutoSize = true;
            this.lblContriStatus.Font = new System.Drawing.Font("Calibri", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblContriStatus.Location = new System.Drawing.Point(291, 150);
            this.lblContriStatus.Name = "lblContriStatus";
            this.lblContriStatus.Size = new System.Drawing.Size(46, 18);
            this.lblContriStatus.TabIndex = 6;
            this.lblContriStatus.Text = "Status";
            // 
            // lblContriRAM
            // 
            this.lblContriRAM.AutoSize = true;
            this.lblContriRAM.Font = new System.Drawing.Font("Calibri", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblContriRAM.Location = new System.Drawing.Point(6, 75);
            this.lblContriRAM.Name = "lblContriRAM";
            this.lblContriRAM.Size = new System.Drawing.Size(70, 18);
            this.lblContriRAM.TabIndex = 5;
            this.lblContriRAM.Text = "Total RAM";
            // 
            // lblContriCreatedBy
            // 
            this.lblContriCreatedBy.AutoSize = true;
            this.lblContriCreatedBy.Font = new System.Drawing.Font("Calibri", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblContriCreatedBy.Location = new System.Drawing.Point(6, 19);
            this.lblContriCreatedBy.Name = "lblContriCreatedBy";
            this.lblContriCreatedBy.Size = new System.Drawing.Size(75, 18);
            this.lblContriCreatedBy.TabIndex = 4;
            this.lblContriCreatedBy.Text = "Created By";
            // 
            // contriImg
            // 
            this.contriImg.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.contriImg.Location = new System.Drawing.Point(443, 19);
            this.contriImg.Name = "contriImg";
            this.contriImg.Size = new System.Drawing.Size(150, 150);
            this.contriImg.TabIndex = 3;
            this.contriImg.TabStop = false;
            // 
            // lstContributed
            // 
            this.lstContributed.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.contriPrjID,
            this.contriPrjName});
            this.lstContributed.Font = new System.Drawing.Font("Calibri", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lstContributed.HideSelection = false;
            this.lstContributed.Location = new System.Drawing.Point(3, 61);
            this.lstContributed.Name = "lstContributed";
            this.lstContributed.Size = new System.Drawing.Size(421, 408);
            this.lstContributed.TabIndex = 2;
            this.lstContributed.UseCompatibleStateImageBehavior = false;
            this.lstContributed.View = System.Windows.Forms.View.Details;
            this.lstContributed.Visible = false;
            this.lstContributed.SelectedIndexChanged += new System.EventHandler(this.lstContributed_SelectedIndexChanged);
            // 
            // contriPrjID
            // 
            this.contriPrjID.Text = "Project ID";
            this.contriPrjID.Width = 204;
            // 
            // contriPrjName
            // 
            this.contriPrjName.Text = "Project Name";
            this.contriPrjName.Width = 213;
            // 
            // label13
            // 
            this.label13.AutoSize = true;
            this.label13.BackColor = System.Drawing.Color.WhiteSmoke;
            this.label13.Font = new System.Drawing.Font("Calibri", 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label13.Location = new System.Drawing.Point(330, 23);
            this.label13.Name = "label13";
            this.label13.Size = new System.Drawing.Size(378, 23);
            this.label13.TabIndex = 1;
            this.label13.Text = "Here you can see projects thats you contributed";
            // 
            // tabDeviceReg
            // 
            this.tabDeviceReg.AutoScroll = true;
            this.tabDeviceReg.Controls.Add(this.label10);
            this.tabDeviceReg.Controls.Add(this.btnRegister);
            this.tabDeviceReg.Controls.Add(this.txtpcname);
            this.tabDeviceReg.Controls.Add(this.label9);
            this.tabDeviceReg.Controls.Add(this.storageCapacity);
            this.tabDeviceReg.Controls.Add(this.label8);
            this.tabDeviceReg.Controls.Add(this.networkCapacity);
            this.tabDeviceReg.Controls.Add(this.label7);
            this.tabDeviceReg.Controls.Add(this.cmbCPU);
            this.tabDeviceReg.Controls.Add(this.label6);
            this.tabDeviceReg.Controls.Add(this.btnLoadDevice);
            this.tabDeviceReg.Controls.Add(this.ramCapacity);
            this.tabDeviceReg.Controls.Add(this.label5);
            this.tabDeviceReg.Controls.Add(this.lblOS);
            this.tabDeviceReg.Controls.Add(this.label4);
            this.tabDeviceReg.Location = new System.Drawing.Point(4, 22);
            this.tabDeviceReg.Name = "tabDeviceReg";
            this.tabDeviceReg.Padding = new System.Windows.Forms.Padding(3);
            this.tabDeviceReg.Size = new System.Drawing.Size(1037, 472);
            this.tabDeviceReg.TabIndex = 0;
            this.tabDeviceReg.Text = "Device Register";
            this.tabDeviceReg.UseVisualStyleBackColor = true;
            // 
            // label10
            // 
            this.label10.AutoSize = true;
            this.label10.Location = new System.Drawing.Point(102, 269);
            this.label10.Name = "label10";
            this.label10.Size = new System.Drawing.Size(659, 182);
            this.label10.TabIndex = 16;
            this.label10.Text = resources.GetString("label10.Text");
            // 
            // btnRegister
            // 
            this.btnRegister.AutoSize = true;
            this.btnRegister.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnRegister.Location = new System.Drawing.Point(607, 202);
            this.btnRegister.Name = "btnRegister";
            this.btnRegister.Size = new System.Drawing.Size(145, 31);
            this.btnRegister.TabIndex = 15;
            this.btnRegister.Text = "Register This Device";
            this.btnRegister.UseVisualStyleBackColor = true;
            this.btnRegister.Click += new System.EventHandler(this.btnRegister_Click);
            // 
            // txtpcname
            // 
            this.txtpcname.Location = new System.Drawing.Point(264, 158);
            this.txtpcname.Name = "txtpcname";
            this.txtpcname.Size = new System.Drawing.Size(136, 20);
            this.txtpcname.TabIndex = 12;
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label9.Location = new System.Drawing.Point(134, 159);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(103, 20);
            this.label9.TabIndex = 11;
            this.label9.Text = "Device Name";
            // 
            // storageCapacity
            // 
            this.storageCapacity.AutoSize = true;
            this.storageCapacity.Location = new System.Drawing.Point(733, 105);
            this.storageCapacity.Maximum = new decimal(new int[] {
            10,
            0,
            0,
            0});
            this.storageCapacity.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.storageCapacity.Name = "storageCapacity";
            this.storageCapacity.Size = new System.Drawing.Size(136, 20);
            this.storageCapacity.TabIndex = 10;
            this.storageCapacity.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label8.Location = new System.Drawing.Point(603, 105);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(100, 20);
            this.label8.TabIndex = 9;
            this.label8.Text = "Storage(GB)";
            // 
            // networkCapacity
            // 
            this.networkCapacity.AutoSize = true;
            this.networkCapacity.Location = new System.Drawing.Point(733, 49);
            this.networkCapacity.Maximum = new decimal(new int[] {
            10,
            0,
            0,
            0});
            this.networkCapacity.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.networkCapacity.Name = "networkCapacity";
            this.networkCapacity.Size = new System.Drawing.Size(136, 20);
            this.networkCapacity.TabIndex = 8;
            this.networkCapacity.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label7.Location = new System.Drawing.Point(603, 49);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(67, 20);
            this.label7.TabIndex = 7;
            this.label7.Text = "Network";
            // 
            // cmbCPU
            // 
            this.cmbCPU.FormattingEnabled = true;
            this.cmbCPU.Location = new System.Drawing.Point(264, 107);
            this.cmbCPU.Name = "cmbCPU";
            this.cmbCPU.Size = new System.Drawing.Size(136, 21);
            this.cmbCPU.TabIndex = 6;
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label6.Location = new System.Drawing.Point(134, 108);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(42, 20);
            this.label6.TabIndex = 5;
            this.label6.Text = "CPU";
            // 
            // btnLoadDevice
            // 
            this.btnLoadDevice.AutoSize = true;
            this.btnLoadDevice.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnLoadDevice.Location = new System.Drawing.Point(264, 202);
            this.btnLoadDevice.Name = "btnLoadDevice";
            this.btnLoadDevice.Size = new System.Drawing.Size(104, 31);
            this.btnLoadDevice.TabIndex = 4;
            this.btnLoadDevice.Text = "Load Data";
            this.btnLoadDevice.UseVisualStyleBackColor = true;
            this.btnLoadDevice.Click += new System.EventHandler(this.btnLoadDevice_Click);
            // 
            // ramCapacity
            // 
            this.ramCapacity.AutoSize = true;
            this.ramCapacity.Location = new System.Drawing.Point(264, 52);
            this.ramCapacity.Maximum = new decimal(new int[] {
            9999,
            0,
            0,
            0});
            this.ramCapacity.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.ramCapacity.Name = "ramCapacity";
            this.ramCapacity.Size = new System.Drawing.Size(136, 20);
            this.ramCapacity.TabIndex = 3;
            this.ramCapacity.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label5.Location = new System.Drawing.Point(134, 54);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(83, 20);
            this.label5.TabIndex = 2;
            this.label5.Text = "RAM (GB)";
            // 
            // lblOS
            // 
            this.lblOS.AutoSize = true;
            this.lblOS.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblOS.Location = new System.Drawing.Point(729, 159);
            this.lblOS.Name = "lblOS";
            this.lblOS.Size = new System.Drawing.Size(73, 20);
            this.lblOS.TabIndex = 1;
            this.lblOS.Text = "Windows";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label4.Location = new System.Drawing.Point(603, 159);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(32, 20);
            this.label4.TabIndex = 0;
            this.label4.Text = "OS";
            // 
            // logingrp
            // 
            this.logingrp.Controls.Add(this.btnlogin);
            this.logingrp.Controls.Add(this.txtpassword);
            this.logingrp.Controls.Add(this.label3);
            this.logingrp.Controls.Add(this.label2);
            this.logingrp.Controls.Add(this.txtemail);
            this.logingrp.Controls.Add(this.label1);
            this.logingrp.Location = new System.Drawing.Point(280, 2);
            this.logingrp.Name = "logingrp";
            this.logingrp.Size = new System.Drawing.Size(519, 459);
            this.logingrp.TabIndex = 2;
            this.logingrp.TabStop = false;
            // 
            // btnlogin
            // 
            this.btnlogin.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnlogin.Location = new System.Drawing.Point(210, 315);
            this.btnlogin.Name = "btnlogin";
            this.btnlogin.Size = new System.Drawing.Size(115, 41);
            this.btnlogin.TabIndex = 5;
            this.btnlogin.Text = "Login";
            this.btnlogin.UseVisualStyleBackColor = true;
            this.btnlogin.Click += new System.EventHandler(this.btnlogin_Click);
            // 
            // txtpassword
            // 
            this.txtpassword.Font = new System.Drawing.Font("Microsoft Sans Serif", 9.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtpassword.Location = new System.Drawing.Point(9, 243);
            this.txtpassword.Name = "txtpassword";
            this.txtpassword.PasswordChar = '*';
            this.txtpassword.Size = new System.Drawing.Size(504, 22);
            this.txtpassword.TabIndex = 4;
            this.txtpassword.Text = "123";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Font = new System.Drawing.Font("Microsoft Sans Serif", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label3.Location = new System.Drawing.Point(6, 210);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(75, 18);
            this.label3.TabIndex = 3;
            this.label3.Text = "Password";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Microsoft Sans Serif", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label2.Location = new System.Drawing.Point(6, 137);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(45, 18);
            this.label2.TabIndex = 2;
            this.label2.Text = "Email";
            // 
            // txtemail
            // 
            this.txtemail.Font = new System.Drawing.Font("Microsoft Sans Serif", 9.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtemail.Location = new System.Drawing.Point(6, 168);
            this.txtemail.Name = "txtemail";
            this.txtemail.Size = new System.Drawing.Size(507, 22);
            this.txtemail.TabIndex = 1;
            this.txtemail.Text = "hasala.dananjaya7@gmail.com";
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Microsoft Sans Serif", 30F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label1.Location = new System.Drawing.Point(40, 32);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(438, 46);
            this.label1.TabIndex = 0;
            this.label1.Text = "Login to Silicon Society";
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1057, 535);
            this.Controls.Add(this.statusStrip1);
            this.Controls.Add(this.tabmain);
            this.Controls.Add(this.logingrp);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Name = "Form1";
            this.Text = "SS-Official";
            this.Load += new System.EventHandler(this.Form1_Load);
            this.statusStrip1.ResumeLayout(false);
            this.statusStrip1.PerformLayout();
            this.tabmain.ResumeLayout(false);
            this.tabProject.ResumeLayout(false);
            this.tabProject.PerformLayout();
            this.grpViewProject.ResumeLayout(false);
            this.grpViewProject.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.prjIMG)).EndInit();
            this.tabContributed.ResumeLayout(false);
            this.tabContributed.PerformLayout();
            this.grpContributed.ResumeLayout(false);
            this.grpContributed.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.contriImg)).EndInit();
            this.tabDeviceReg.ResumeLayout(false);
            this.tabDeviceReg.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.storageCapacity)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.networkCapacity)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.ramCapacity)).EndInit();
            this.logingrp.ResumeLayout(false);
            this.logingrp.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.StatusStrip statusStrip1;
        private System.Windows.Forms.ToolStripStatusLabel lblStatus;
        private System.Windows.Forms.TabControl tabmain;
        private System.Windows.Forms.TabPage tabDeviceReg;
        private System.Windows.Forms.TabPage tabProject;
        private System.Windows.Forms.GroupBox logingrp;
        private System.Windows.Forms.Button btnlogin;
        private System.Windows.Forms.TextBox txtpassword;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox txtemail;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.ComboBox cmbCPU;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.Button btnLoadDevice;
        private System.Windows.Forms.NumericUpDown ramCapacity;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.Label lblOS;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Button btnRegister;
        private System.Windows.Forms.TextBox txtpcname;
        private System.Windows.Forms.Label label9;
        private System.Windows.Forms.NumericUpDown storageCapacity;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.NumericUpDown networkCapacity;
        private System.Windows.Forms.Label label10;
        private System.Windows.Forms.ListView lstNewProject;
        private System.Windows.Forms.ColumnHeader prjName;
        private System.Windows.Forms.ColumnHeader prjRAM;
        private System.Windows.Forms.Label label11;
        private System.Windows.Forms.Label lblProjectWait;
        private System.Windows.Forms.ColumnHeader prjID;
        private System.Windows.Forms.GroupBox grpViewProject;
        private System.Windows.Forms.PictureBox prjIMG;
        private System.Windows.Forms.Label lblProjectDescription;
        private System.Windows.Forms.Label label12;
        private System.Windows.Forms.Label lblSeparateTask;
        private System.Windows.Forms.Label lblOwnerID;
        private System.Windows.Forms.Button btnContribute;
        private System.Windows.Forms.Label lblSoftwareID;
        private System.Windows.Forms.Label lblNeedDevice;
        private System.Windows.Forms.Button btnNewProjectHelp;
        private System.Windows.Forms.Button btnNewProjectRefresh;
        private System.Windows.Forms.TabPage tabContributed;
        private System.Windows.Forms.ListView lstContributed;
        private System.Windows.Forms.Label label13;
        private System.Windows.Forms.Label lblLoadingContributed;
        private System.Windows.Forms.GroupBox grpContributed;
        private System.Windows.Forms.Label lblContriCreatedBy;
        private System.Windows.Forms.PictureBox contriImg;
        private System.Windows.Forms.ColumnHeader contriPrjID;
        private System.Windows.Forms.ColumnHeader contriPrjName;
        private System.Windows.Forms.Label label14;
        private System.Windows.Forms.Label lblSoftID;
        private System.Windows.Forms.Label lblContriSeparate;
        private System.Windows.Forms.Label lblContriOS;
        private System.Windows.Forms.Label lblContriStatus;
        private System.Windows.Forms.Label lblContriRAM;
        private System.Windows.Forms.Label lblContriDesc;
        private System.Windows.Forms.Button btnLeveContributions;
        private System.Windows.Forms.Button btnContriRefresh;
    }
}

