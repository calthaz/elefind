package general;
import static java.lang.Math.sqrt;
//import java.awt.BasicStroke;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.FileDialog;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.RenderingHints;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.awt.image.BufferedImage;
import java.awt.image.RasterFormatException;
import java.awt.image.RescaleOp;
import java.io.File;
import java.io.IOException;
import java.text.NumberFormat;
import javax.imageio.ImageIO;
import javax.swing.*;

import imprSearch.Impression;

/**
 * This class serves as the drawing pad 
 * onto which the user paint the impression of the photo.
 * It then offers the main program this sketch for processing.
 * 
 * Note: the implementation for undo and redo is not completed. 
 * Note: the mouseMove method may cause exception
 * Note: the relativity value is currently not used in the comparison method
 * Note: the contrast value is currently not used
 * IMPORTANT Note: this version is not completed. Choosing files as draft to search is not supporter
 */

public class SketchPad1 extends JPanel implements ActionListener, MouseMotionListener, MouseListener{
	private static final long serialVersionUID = 1L;
	
	//dimensions
	public static final int PAD_HEIGHT = Utils.DISPLAY_HEIGHT;
	public static final int CANVAS_WIDTH = Utils.DISPLAY_WIDTH;
	public static final int TOOL_WIDTH = 320;
	public static final int MAX_R = 50;
	public static final int MAX_RLY = 10;
	private static final int MAX_STEPS = 10;
	
	//swing components
	private JButton reset,fillUp,undo,redo,bgChooser,penChooser,save,load;
	private JFormattedTextField width, height;
	private JTextField nameField;
	private ButtonGroup tools;
	private JSlider contrast,radius,reliability;
	private Canvas canvas;
	//private JColorChooser cchooser;
	private Color bgColor = Color.WHITE;
	private Color penColor = Color.BLACK;
	private JRadioButton bg,pen;
	private JLabel position = new JLabel("Current Position: ");
		
	//Appearances background imgs
	private BufferedImage display = new BufferedImage(CANVAS_WIDTH,PAD_HEIGHT,BufferedImage.TYPE_INT_ARGB);
	private BufferedImage draft;
	/**
	 * x1,y1 should be the absolute coordination of the upper left corner of the selected region. 
	 * x2,y2 should be the absolute coordination of the lower right corner of the selected region. 
	 */
	private int x1,y1,x2,y2;
	private int offsetX,offsetY;
	private double ratio;
	private BufferedImage mask; 
	
	int cnt=0;
	//int lastX,lastY;
	
	private BufferedImage[] versions = new BufferedImage[MAX_STEPS];
	private int currentVersion = 0;

	
	public SketchPad1(){
	
		//this.setOneTouchExpandable(true);
	
		//initialize layout
		this.setLayout(new BorderLayout());
		
		Dimension setD = new Dimension(TOOL_WIDTH,PAD_HEIGHT);
		Dimension scrollD = new Dimension(CANVAS_WIDTH,PAD_HEIGHT);
		
		reset = new JButton("Reset 重置");
		fillUp = new JButton("Fill up the canvas 填充画面");
		undo = new JButton("Undo 撤销");
		undo.setEnabled(false);
		redo = new JButton("Redo 重做");
		redo.setEnabled(false);
		bgChooser = new JButton();
		bgChooser.setBackground(Color.WHITE);
		penChooser = new JButton();
		penChooser.setBackground(Color.BLACK);
		//cchooser = new JColorChooser();
		save=new JButton("Save Draft 保存");
		load=new JButton("Load Draft 打开");
		
		width = new JFormattedTextField(NumberFormat.getNumberInstance());
		width.setValue(5);
		height = new JFormattedTextField(NumberFormat.getNumberInstance());
		height.setValue(4);
		nameField = new JTextField();
		nameField.setText("My Impression");
		
		tools = new ButtonGroup();
		bg = new JRadioButton("Background");
		pen = new JRadioButton("Pen");
		pen.setSelected(true);
		tools.add(bg);
		tools.add(pen);
		
		Dimension preferredSize = new Dimension (180,50);
		contrast = new JSlider(JSlider.HORIZONTAL,0,100,50);
		radius = new JSlider(JSlider.HORIZONTAL,10,MAX_R,MAX_R/4);
		reliability = new JSlider(JSlider.HORIZONTAL,1,MAX_RLY,MAX_RLY/2);
		contrast.setMajorTickSpacing(10);
		contrast.setMinorTickSpacing(5);
		contrast.setPaintTicks(true);
		contrast.setPaintLabels(true);
		contrast.setPreferredSize(preferredSize);
		
		radius.setMajorTickSpacing(10);
		radius.setMinorTickSpacing(5);
		radius.setPaintTicks(true);
		radius.setPaintLabels(true);
		radius.setPreferredSize(preferredSize);
		
		reliability.setMajorTickSpacing(1);
		//reliability.setMinorTickSpacing(5);
		reliability.setPaintTicks(true);
		reliability.setPaintLabels(true);
		
		/*//Sample code from Java tutorial
		 * //Create the slider
			JSlider framesPerSecond = new JSlider(JSlider.VERTICAL,
                                      FPS_MIN, FPS_MAX, FPS_INIT);
			framesPerSecond.addChangeListener(this);
			framesPerSecond.setMajorTickSpacing(10);
			framesPerSecond.setPaintTicks(true);

			//Create the label table
			Hashtable labelTable = new Hashtable();
			labelTable.put( new Integer( 0 ), new JLabel("Stop") );
			labelTable.put( new Integer( FPS_MAX/10 ), new JLabel("Slow") );
			labelTable.put( new Integer( FPS_MAX ), new JLabel("Fast") );
			framesPerSecond.setLabelTable( labelTable );

			framesPerSecond.setPaintLabels(true);
		 */
		
		JPanel settings = new JPanel();
		settings.setLayout(new GridBagLayout());
		settings.setPreferredSize(setD);
		
		organizeSettings(settings);
	
		//JScrollPane canvas = new JScrollPane();
		//canvas.setPreferredSize(new Dimension(700,1000));
		//this.setLeftComponent(canvas);
		//this.setRightComponent(settings);
		this.add(settings,BorderLayout.EAST);
		//this.setColumnHeaderView(settings);
		
		canvas = new Canvas();
		//canvas.setCursor(cursor);//I wish for a pen-shaped cursor...
		JScrollPane scroller = new JScrollPane(canvas);
		scroller.setPreferredSize(scrollD);
		this.add(scroller,BorderLayout.CENTER);
		this.add(position, BorderLayout.NORTH);
		
		//add listeners
		reset.addActionListener(this);
		fillUp.addActionListener(this);
		undo.addActionListener(this);
		redo.addActionListener(this);
		bgChooser.addActionListener(this);
		penChooser.addActionListener(this);
		save.addActionListener(this);
		load.addActionListener(this);
		//these listener listen for events in canvas, so the returned coordinates should be inside canvas?
		canvas.addMouseMotionListener(this);
		canvas.addMouseListener(this);
		
		versions[currentVersion]= copy(display);//TODO fix later
		
		resetCanvas();
		
		draft = new BufferedImage(Utils.DRAFT_WIDTH,Utils.DRAFT_HEIGHT,Impression.IMAGE_TYPE);
		x1=y1=0;
		x2=draft.getWidth()-1;
		y2=draft.getHeight()-1;
		System.out.println(String.format("upper left corner: %s %s, lower right corner: %s %s. ", x1,y1,x2,y2));
		drawDisplayFromDraft();
		refresh();
		setDimenFieldsByDraft();
	}
	
	private void organizeSettings(JPanel settings){
		GridBagConstraints c = new GridBagConstraints();
		c.weightx=0.5;
		c.weighty=0.5;	
		//c.anchor=GridBagConstraints.CENTER;
		
		
		c.fill=GridBagConstraints.HORIZONTAL;
		c.gridx=0;
		c.gridy=0;
		c.gridwidth=2;
		
		settings.add(new JLabel("Width : Height"),c);
		
		c.fill=GridBagConstraints.HORIZONTAL;
		c.gridx=0;
		c.gridy=1;
		c.gridwidth=1;
		settings.add(width,c);
		/*
		c.fill=GridBagConstraints.HORIZONTAL;
		c.gridx=1;
		c.gridy=1;
		c.gridwidth=1;
		settings.add(new JLabel(" : "),c);
		*/
		c.fill=GridBagConstraints.HORIZONTAL;
		c.gridx=1;
		c.gridy=1;
		c.gridwidth=1;
		settings.add(height,c);
		
		c.fill=GridBagConstraints.HORIZONTAL;
		c.gridx=0;
		c.gridy=2;
		c.gridwidth=2;
		settings.add(reset,c);
		
		c.fill=GridBagConstraints.HORIZONTAL;
		c.gridx=0;
		c.gridy=3;
		c.gridwidth=1;
		settings.add(bg,c);
		
		c.fill=GridBagConstraints.HORIZONTAL;
		c.gridx=1;
		c.gridy=3;
		c.gridwidth=1;
		settings.add(new JLabel("Contrast 对比度"),c);
		
		c.fill=GridBagConstraints.HORIZONTAL;
		c.gridx=0;
		c.gridy=4;
		c.gridwidth=1;
		settings.add(bgChooser,c);
		
		c.fill=GridBagConstraints.HORIZONTAL;
		c.gridx=1;
		c.gridy=4;
		c.gridwidth=1;
		settings.add(contrast,c);
		
		c.fill=GridBagConstraints.HORIZONTAL;
		c.gridx=0;
		c.gridy=5;
		c.gridwidth=2;
		settings.add(fillUp,c);
		
		c.fill=GridBagConstraints.HORIZONTAL;
		c.gridx=0;
		c.gridy=6;
		c.gridwidth=1;
		settings.add(pen,c);
		
		c.fill=GridBagConstraints.HORIZONTAL;
		c.gridx=1;
		c.gridy=6;
		c.gridwidth=1;
		settings.add(new JLabel("Radius 半径"),c);
		
		c.fill=GridBagConstraints.HORIZONTAL;
		c.gridx=0;
		c.gridy=7;
		c.gridwidth=1;
		settings.add(penChooser,c);
		
		c.fill=GridBagConstraints.HORIZONTAL;
		c.gridx=1;
		c.gridy=7;
		c.gridwidth=1;
		settings.add(radius,c);
		
		c.fill=GridBagConstraints.HORIZONTAL;
		c.gridx=0;
		c.gridy=8;
		c.gridwidth=1;
		settings.add(undo,c);
		
		c.fill=GridBagConstraints.HORIZONTAL;
		c.gridx=1;
		c.gridy=8;
		c.gridwidth=1;
		settings.add(redo,c);
		
		c.fill=GridBagConstraints.HORIZONTAL;
		c.gridx=0;
		c.gridy=9;
		c.gridwidth=2;
		settings.add(new JLabel("Your draft name:"),c);//"Reliability"
		/*
		c.fill=GridBagConstraints.HORIZONTAL;
		c.gridx=0;
		c.gridy=10;
		c.gridwidth=2;
		settings.add(reliability,c);
		*/
		c.fill=GridBagConstraints.HORIZONTAL;
		c.gridx=0;
		c.gridy=10;
		c.gridwidth=2;
		settings.add(nameField,c);
		
		c.gridy=11;
		settings.add(save, c);
		c.gridy=12;
		settings.add(load, c);
	}
	
	
	@SuppressWarnings("serial")
	public class Canvas extends JPanel{ 
		public int lastX,lastY;
		//What a surprise that I can write an entire class here. 
		//TODO　double reference? Check the pointer?
		protected void paintComponent(Graphics g) { 
			super.paintComponent(g);//Why?
			Graphics2D g2 = (Graphics2D)g;    
			g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON); 
			g2.drawImage(display, 0, 0, display.getWidth(), display.getHeight(), null);
			if(mask!=null)g2.drawImage(mask, 0, 0, mask.getWidth(), mask.getHeight(), null);
		}
	}
	
	/**
	 * The main program or any clients should call this method 
	 * to get what is displayed on canvas of this sketch pad.
	 * @return the image on display on canvas
	 */
	public BufferedImage getDraft() {
		return draft;
	}
	
	/**
	 * The client call this method to get a user-defined coefficient for further processing.
	 * @return the coefficient hereby called reliability
	 */
	public int getRly(){
		return reliability.getValue();
	}
	
	public String getDraftName(){
		return nameField.getText();
	}
	
	
	public void displayImage(File file){
		try {
			BufferedImage temp = (BufferedImage)ImageIO.read(file);
			Dimension d = Utils.scaleUniformFit(temp.getWidth(),temp.getHeight(),CANVAS_WIDTH,PAD_HEIGHT);	
			
			display = new BufferedImage(d.width,d.height,Impression.IMAGE_TYPE);
			display.getGraphics().drawImage(temp, 0, 0, d.width, d.height, null);
			
			refresh();
			
			nameField.setText(file.getName());
		} catch (IOException e) {
			e.printStackTrace();
		}
		refresh();
		setDimenFieldsByDisplay();
	}
	
	public void displayImage(BufferedImage img){
		//display = copy(img); //Attention! display's value remains unchanged after this block! Really? Maybe not. 
		display=img;
		mask=null;
		refresh();
		setDimenFieldsByDisplay();
	}
	
	public void displayMask(BufferedImage img){
		//must properly mask the current display
		mask=new BufferedImage(display.getWidth(),display.getHeight(),BufferedImage.TYPE_INT_ARGB);
		BufferedImage temp = new BufferedImage(display.getWidth(),display.getHeight(),BufferedImage.TYPE_INT_ARGB);
		Graphics2D g2d = (Graphics2D) temp.getGraphics();
		g2d.drawImage(img, 0, 0, display.getWidth(), display.getHeight(), null);
		g2d.dispose();
		//TODO transparency:
		Graphics2D g2d1 = (Graphics2D) mask.getGraphics();
		float[] scales = { 1f, 1f, 1f, 0.8f };
		float[] offsets = new float[4];
		RescaleOp rop = new RescaleOp(scales, offsets, null);
		g2d1.drawImage(temp, rop, 0, 0);
		g2d1.dispose();
		refresh();
	}
	
	/**
	 * project what is drawn onto the draft to the display object, only the selected area
	 */
	private void drawDisplayFromDraft(){
		BufferedImage shown = draft.getSubimage(x1, y1, x2-x1, y2-y1);
		Dimension d = Utils.scaleUniformFit(shown.getWidth(),shown.getHeight(),display.getWidth(),display.getHeight());
		Graphics2D g = display.createGraphics();
		offsetX=0;
		offsetY=0;
		ratio = (double)d.height/shown.getHeight();
		if(d.width<display.getWidth())offsetX=(display.getWidth()-d.width)/2;
		if(d.height<display.getHeight())offsetY=(display.getHeight()-d.height)/2;
		//System.out.println(String.format("offsetX %s, offsetY %s, ratio %s", offsetX,offsetY,ratio));
		g.drawImage(shown, offsetX, offsetY, d.width, d.height, null);
		g.dispose();
	}
	
	/**
	 * project what is drawn onto the draft to the display object, only the selected area
	 * be careful, these values may not be within the draft. 
	 * what about repaint?
	 */
	private void drawDisplayFromDraft(int x, int y, int w, int h){
		int cx = (int) (this.x1+(x-offsetX)/ratio);
		int cy = (int) (this.y1+(y-offsetY)/ratio);
		int cw = (int)(w/ratio);
		int ch = (int)(h/ratio);
		if(cx<0)cx=0;
		if(cy<0)cy=0;
		if(cx+cw>draft.getWidth()-1)cw=draft.getWidth()-cx-1;
		if(cy+ch>draft.getHeight()-1)ch=draft.getHeight()-cy-1;
		try{
			BufferedImage clip = draft.getSubimage(cx, cy, cw, ch);
			Graphics2D g = display.createGraphics();
			//System.out.println(String.format("offsetX %s, offsetY %s, ratio %s", offsetX,offsetY,ratio));
			//g.drawImage(clip, x+offsetX, y+offsetY, (int)(cw*ratio), (int)(ch*ratio), null);
			g.drawImage(clip, x, y,cw, ch, null);//TODO
			//g.drawRect(x, y, w, h);
			g.dispose();
		}catch(RasterFormatException e){
			//e.printStackTrace();
			System.out.println(String.format("Outside raster! Clip dimensions: x:%s y:%s w:%s h:%s", cx, cy, cw, ch));
			
		}
		
	}
	
	/**
	 * invoked after the display object has been modified
	 * to tell the scroll pane to adjust to the new size
	 * and update the size information in the text fields
	 */
	private void refresh(){
		canvas.setPreferredSize(new Dimension(display.getWidth(),display.getHeight()));
		//tells its parent component:"I wish I could have a space of that size!"
		//so the scroller says "OK, I can give you a pair of scrollbars."
		canvas.revalidate();
		//"REVALIDATE! Now your dream has come true." Says the scroller. 
		repaint();
		/*
		int w = draft.getWidth();
		int h = draft.getHeight();
		int r = findCommonFactor(w,h);
		width.setValue(w/r);
		height.setValue(h/r);
		*/
	}
	
	private void setDimenFieldsByDraft(){
		int w = draft.getWidth();
		int h = draft.getHeight();
		int r = findCommonFactor(w,h);
		width.setValue(w/r);
		height.setValue(h/r);
	}
	
	private void setDimenFieldsByDisplay(){
		int w = display.getWidth();
		int h = display.getHeight();
		int r = findCommonFactor(w,h);
		width.setValue(w/r);
		height.setValue(h/r);
	}
	

	private BufferedImage copy(BufferedImage old){
		//TODO: improve efficiency
		BufferedImage img = new BufferedImage(old.getWidth(),old.getHeight(),Impression.IMAGE_TYPE);
		//img=old.getSubimage(0, 0, old.getWidth(), old.getHeight());
		//Returns a subimage defined by a specified rectangular region. 
		//The returned BufferedImage SHARES the same data array as the original image.
		
		for (int i=0; i<old.getHeight(); i++){
			for(int j=0; j<old.getWidth(); j++){
				img.setRGB(j, i, old.getRGB(j,i));
			}
		}
		return img;
	}
	
	
	private int findCommonFactor(int a, int b) {
		int nu = Math.max(a, b);
		int de = Math.min(a, b);
		while(true){
			int t = de;
			de = nu%de;
			nu = t; 
			if(de == 0)break;
		}
		return nu;
	}
	
	private void resetCanvas(){
		//commit edit?
		int w=((Number)width.getValue()).intValue();
		int h= ((Number)height.getValue()).intValue();
		if(w>0&&h>0){
			
			int r = findCommonFactor(w,h);
			width.setValue((Number)(w/r));
			height.setValue(h/r);
			display = new BufferedImage(CANVAS_WIDTH,PAD_HEIGHT,BufferedImage.TYPE_INT_ARGB);
			Dimension d = Utils.scaleUniformFit(w, h, Utils.DRAFT_WIDTH, Utils.DRAFT_HEIGHT);
			draft = new BufferedImage(d.width,d.height,Impression.IMAGE_TYPE);
			x1=y1=0;
			x2=draft.getWidth()-1;
			y2=draft.getHeight()-1;
			System.out.println(String.format("upper left corner: %s %s, lower right corner: %s %s. ", x1,y1,x2,y2));
			drawDisplayFromDraft();
			mask=null;
			//display=new BufferedImage(w,h,Impression.IMAGE_TYPE);
			//TODO clear versions.;
			currentVersion=0;
			for(int i = 0; i<versions.length;i++){
				versions[i]=null;
			}
			System.out.println(String.format("offsetX %s, offsetY %s, ratio %s", offsetX,offsetY,ratio));
			versions[currentVersion]= copy(display);
			refresh();
			//setDimenFieldsByDraft();
			//System.out.println("Reset canvas size to "+w/r+" : "+h/r+" and clear versions memory.");
			System.out.println("Reset canvas size to "+w+" : "+h+" and clear versions memory.");
		}
	}
	@Override
	public void actionPerformed(ActionEvent e) {
		if(e.getSource()==reset){
			resetCanvas();
			
		}else if(e.getSource()== fillUp){
			if(bgColor==Color.BLACK||bgColor==Color.WHITE){
				Graphics g = draft.getGraphics();
				g.setColor(bgColor);
				g.fillRect(0, 0, draft.getWidth(), draft.getHeight());
				g.dispose();//TODO a silly way to make the region opaque. And it doesn't work!
				for(int j = 0; j<draft.getHeight();j++){
					for(int i = 0; i<draft.getWidth();i++){
						if((i+j)%2==0) draft.setRGB(i, j, 0);
						else draft.setRGB(i, j, 0xFFFFFF);
					}
				}
				
			}else{
				Graphics g = draft.getGraphics();
				g.setColor(bgColor);
				g.fillRect(0, 0, draft.getWidth(), draft.getHeight());
				g.dispose();
			}
			drawDisplayFromDraft(0,0,display.getWidth(),display.getHeight());
			repaint();
		}else if(e.getSource()== bgChooser ){
			Color newColor = JColorChooser.showDialog(this, "Choose Background Color", bgColor);
			if (newColor != null) {
				bgColor = newColor;
				bgChooser.setBackground(newColor);
			}
		}else if(e.getSource()== penChooser ){
			Color newColor = JColorChooser.showDialog(this, "Choose Background Color", penColor);
			if (newColor != null) {
				penColor = newColor;
				penChooser.setBackground(newColor);
			}
			
		}else if(e.getSource()==undo){
			display=copy(versions[--currentVersion%MAX_STEPS]);//Copy it! you will modify the content of this element otherwise
			redo.setEnabled(true);
			if(currentVersion==0)undo.setEnabled(false); //TODO something is wrong here/%MAX_STEPS
			refresh();
			System.out.println("Undo: Current version: "+currentVersion+" and versions count: "+versions.length);
		}else if(e.getSource()== redo){
			display=copy(versions[++currentVersion%MAX_STEPS]);
			if(currentVersion%MAX_STEPS == MAX_STEPS-1)redo.setEnabled(false);
			refresh();
			System.out.println("Redo: Current version: "+currentVersion+" and versions count: "+versions.length);
		}else if(e.getSource()==save){
			
			//This is the only awt component in this project. How to specify the saving type?
			System.out.println("try to save");
			JFrame saveDialog = new JFrame();
			//saveDialog.setVisible(true);
			FileDialog saveFile = new FileDialog(saveDialog, "Save Draft", FileDialog.SAVE);
			//JFileChooser chooser = new JFileChooser("...");
			saveFile.setFile(Utils.DEPOSIT_POSITION+nameField.getText()+".png");
			//saveFile.setFilenameFilter();
			saveFile.setVisible(true);
			File outFile = null;
			
			if(saveFile.getFile()!= null){
				String name = saveFile.getFile();
				if(name.indexOf(".")==-1)name+=".png";
				outFile = new File(saveFile.getDirectory(),name);  
				try {  
					ImageIO.write(draft, "png", outFile);  
					System.out.println("Saved as:"+name);
				} catch (IOException e1) {  
					e1.printStackTrace();  
				}  
			}
			saveDialog.dispose();//How do I know if this works?--Set it visible first.
			
			
		}else if(e.getSource()==load){
			System.out.println("loading draft");
			JFrame loadDialog = new JFrame();
			FileDialog loadFile = new FileDialog(loadDialog, "Load Draft", FileDialog.LOAD);
			loadFile.setVisible(true);
			if(loadFile.getFile()!=null){
				try { 
					System.out.println("try to load draft:"+loadFile.getDirectory()+loadFile.getFile()); 
					loadDraft(ImageIO.read(new File(loadFile.getDirectory()+loadFile.getFile())));  //loadFile.getFile()
					//stupid
					nameField.setText(loadFile.getFile());
					//refresh();
					
				} catch (IOException e1) {  
					e1.printStackTrace();  
				}  
			}
		}
	}
	
	public void loadDraft(BufferedImage draft){
		this.draft=draft;
		x1=y1=0;
		x2=draft.getWidth()-1;
		y2=draft.getHeight()-1;
		display=new BufferedImage(CANVAS_WIDTH,PAD_HEIGHT,BufferedImage.TYPE_INT_ARGB);
		drawDisplayFromDraft();
		refresh();
		setDimenFieldsByDraft();
	}
	
	/**
	 * 
	 * @param x of the center of the dot
	 * @param y of the center of the dot
	 * @param r radius of the circle
	 */
	private void drawBackgroundDot(int x, int y, int r){
		Graphics2D g = draft.createGraphics();
		g.fillOval(x-r, y-r, 2*r, 2*r);
		g.dispose();//TODO a silly way to make the circle opaque. 
		for(int j = y-r; j < y+r+1; j++){
			if (!(j<0)&&j<draft.getHeight()){
				for(int i = x-r; i<x+r+1; i++){
					if(!(i<0)&&i<draft.getWidth() && !(sqrt((i-x)*(i-x)+(j-y)*(j-y))>r)){
						
						if((i+j)%2==0)draft.setRGB(i, j, 0); //TODO pixel transparent!
						else draft.setRGB(i, j, 0xFFFFFF);
						
					}
				}
			}
		}
	}
	
	@Override
	//TODO e.x, e.y may be out of the border of display.
	public void mouseDragged(MouseEvent e) {
		//cnt++;
		//System.out.println("Draw a dot "+cnt);
		int x1=canvas.lastX;
		int y1=canvas.lastY;
		int x2 = (int) (this.x1+(e.getX()-offsetX)/ratio);//e.getX();//
		int y2 = (int) (this.y1+(e.getY()-offsetY)/ratio);//e.getY();
		int r = radius.getValue();
		//r = inkStyle(x1-x2,y1-y2,r);
		
		if(pen.isSelected()){//&& cnt%5==0
			Graphics2D g = (Graphics2D) draft.getGraphics();
			g.setColor(penColor);
			/*//it looks very strange, especially when you drag your mouse slowly
			BasicStroke str = new BasicStroke(2*r, BasicStroke.CAP_BUTT,
					BasicStroke.JOIN_BEVEL);
			g.setStroke(str);
			*/
			
		
			if (x1-x2!=0 && (y1-y2)/(double)(x1-x2)<=1&&(y1-y2)/(double)(x1-x2)>=-1) {
				double k = (y1-y2)/(double)(x1-x2);
				int x = x1;
				int y = y1;
				while(x!=x2){
					y = (int) ((x-x1)*(k)+y1);
					g.fillOval(x-r, y-r, 2*r, 2*r);
					drawDisplayFromDraft((int)(e.getX()-r*ratio),(int)(e.getY()-r*ratio),(int)(2*r*ratio),(int)(2*r*ratio));
					canvas.repaint((int)(e.getX()-r*ratio),(int)(e.getY()-r*ratio),(int)(2*r*ratio),(int)(2*r*ratio));
					if(x1>x2)x--;
					else x++;
				}
			}else{
				//int y = y1;
				double k = (x1-x2)/(double)(y1-y2);
				int x = x1;
				int y = y1;
				while(y!=y2){
					x = (int) ((y-y1)*(k)+x1);
					g.fillOval(x-r, y-r, 2*r, 2*r);
					drawDisplayFromDraft((int)(e.getX()-r*ratio),(int)(e.getY()-r*ratio),(int)(2*r*ratio),(int)(2*r*ratio));
					canvas.repaint((int)(e.getX()-r*ratio),(int)(e.getY()-r*ratio),(int)(2*r*ratio),(int)(2*r*ratio));
					if(y1>y2)y--;
					else y++;
				}
			}
			/*for(int x = x1; x<=x2; x++){
				int y = (int) ((x-x1)*(k)+y1);
				g.fillOval(x-r, y-r, 2*r, 2*r);
				canvas.repaint(x-r,y-r,2*r,2*r);
			//System.out.println("Draw a dot");
			}
			*/
			//TODO Too slow,can't catch up with my movement.
			//g.drawLine(lastX, lastY, x, y);
			//repaint(lastX, lastY, x, y);
			//repaint();
			
		}else if(bg.isSelected()){
			int ctr = contrast.getValue();
			if (x1-x2!=0 && (y1-y2)/(double)(x1-x2)<=1&&(y1-y2)/(double)(x1-x2)>=-1) {
				double k = (y1-y2)/(double)(x1-x2);
				int x = x1;
				int y = y1;
				while(x!=x2){
					y = (int) ((x-x1)*(k)+y1);
					drawBackgroundDot(x, y, r);
					drawDisplayFromDraft((int)(e.getX()-r*ratio),(int)(e.getY()-r*ratio),(int)(2*r*ratio),(int)(2*r*ratio));
					canvas.repaint((int)(e.getX()-r*ratio),(int)(e.getY()-r*ratio),(int)(2*r*ratio),(int)(2*r*ratio));
					if(x1>x2)x--;
					else x++;
				}
			}else{
				//int y = y1;
				double k = (x1-x2)/(double)(y1-y2);
				int x = x1;
				int y = y1;
				while(y!=y2){
					x = (int) ((y-y1)*(k)+x1);
					drawBackgroundDot(x, y, r);
					drawDisplayFromDraft((int)(e.getX()-r*ratio),(int)(e.getY()-r*ratio),(int)(2*r*ratio),(int)(2*r*ratio));
					canvas.repaint((int)(e.getX()-r*ratio),(int)(e.getY()-r*ratio),(int)(2*r*ratio),(int)(2*r*ratio));
					if(y1>y2)y--;
					else y++;
				}
			}
		}
		
		canvas.lastX=x2;
		canvas.lastY=y2;
		//drawDisplayFromDraft();
		
	}
	
	private int inkStyle(int dx, int dy, int r){
		double ds = sqrt(dx*dx+dy*dy);
		if(ds/r<1)r+=5*ds/r;
		else r-=5*(1-r/ds);
		return r;
	}

	@Override
	public void mouseMoved(MouseEvent e) {
		int x = e.getX();
		int y = e.getY();
		//for debugging, testing the frequency of such event
				//cnt++;
				//System.out.println("Draw a dot "+cnt);
				/*
				cnt++;
				if(pen.isSelected()){//&& cnt%5==0
					
					int r = radius.getValue();
					Graphics g = display.getGraphics();
					g.setColor(penColor);
					g.fillOval(x-r, y-r, 2*r, 2*r);
					//System.out.println("Draw a dot");
					repaint(x-r,y-r,2*r,2*r);//TODO Too slow,can't catch up with my movement. 
				}*/
		if(!(x<0)&&!(x>=display.getWidth())&&!(y<0)&&!(y>=display.getHeight())){
			//TODO: canvas x,y? draft x,y?
			//try{
				int c = display.getRGB(x, y);
				int r = (c>>16)&0xFF;
				int g = (c>>8)&0xFF;
				int b = c&0xFF;
				position.setText("Curent Position: ("+x+","+y+") and the color at this position is "+r+", "+g+", "+b+".");
			//}catch(ArrayIndexOutOfBoundsException e1){
				//System.out.println("Coordinate out of bounds! "+x+","+y);
			//}
			
		}
	}

	@Override
	public void mouseClicked(MouseEvent arg0) {
		// Auto-generated method stub
	}

	@Override
	public void mouseEntered(MouseEvent arg0) {
		// Auto-generated method stub
	}

	@Override
	public void mouseExited(MouseEvent arg0) {
		// Auto-generated method stub
	}

	@Override
	public void mousePressed(MouseEvent e) {
		int x = (int) (this.x1+(e.getX()-offsetX)/ratio);//e.getX();
		int y = (int) (this.y1+(e.getY()-offsetY)/ratio);//e.getY();
		
		canvas.lastX=x;
		canvas.lastY=y;
		int r = radius.getValue();
		if(pen.isSelected()){
			
			Graphics g = draft.getGraphics();
			g.setColor(penColor);
			g.fillOval(x-r, y-r, 2*r, 2*r);
			//System.out.println("Draw a dot");
			
		}else if(bg.isSelected()){
			int ctr = contrast.getValue();
			//display.setRGB(arg0, arg1, arg2);
			drawBackgroundDot(x,y,r);
		}
		
		drawDisplayFromDraft((int)(e.getX()-r*ratio),(int)(e.getY()-r*ratio),(int)(2*r*ratio),(int)(2*r*ratio));
		canvas.repaint((int)(e.getX()-r*ratio),(int)(e.getY()-r*ratio),(int)(2*r*ratio),(int)(2*r*ratio));//
	}

	@Override
	/**
	 * Note: should save a copy now!
	 */
	public void mouseReleased(MouseEvent arg0) {
		drawDisplayFromDraft();
		canvas.repaint();
		undo.setEnabled(true);
		redo.setEnabled(false);
		versions[++currentVersion%10]= copy(display);
		System.out.println("MouseReleased saved as version "+currentVersion);
		//System.out.println("Current version: "+currentVersion+" and versions count: "+versions.size());
	}
	
}
