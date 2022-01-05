--[[TO-DO] -------------------------------------------------------------------------------------------------

--]] -------------------------------------------------------------------------------------------------------

--[[UPDATES] -----------------------------------------------------------------------------------------------
CM20200606:	Added routine receptor and taps.
			Added routine receptor, taps and halfdouble receptor.
			It seems that there's no way to play a Routine Halfdouble atm.
			Added some indentation.
			Now NX2 noteskin serves as default and can load everything from other noteskins that fallback it
--]] -------------------------------------------------------------------------------------------------------

local skin_name = Var("skin_name");
return function(button_list, stepstype, skin_parameters)
	local ret= {}
	
	local tap_press= {
		DownLeftStepNote	= 5,
		UpLeft		= 6,
		Center		= 7,
		UpRight		= 8,
		DownRight	= 9
	}
	
	local stepsTypeTable = {
		StepsType_Pump_Single = {
			receptor	= {"", "", NOTESKIN:get_path(skin_name, NOTESKIN:get_path(skin_name, "HD/Center ReceptorFactory")), "", ""},
			tap			= NOTESKIN:get_path(skin_name, "HD/Tap")
		},
		StepsType_Pump_Halfdouble = {
			receptor 	= {NOTESKIN:get_path(skin_name, "HD/Center HD1Receptor"), "", "", "", "", NOTESKIN:get_path(skin_name, "HD/Center HD2Receptor")},
			tap			= NOTESKIN:get_path(skin_name, "HD/Tap")
		},
		StepsType_Pump_Double = {
			receptor	= {"", "", NOTESKIN:get_path(skin_name, "HD/Center ReceptorFactory"), "", "", "", "", NOTESKIN:get_path(skin_name, "HD/Center ReceptorFactory"), "", ""},
			tap			= NOTESKIN:get_path(skin_name, "HD/Tap")
		},
		StepsType_Pump_Couple = {
			receptor	= {"", "", NOTESKIN:get_path(skin_name, "HD/Center ReceptorFactory"), "", "", "", "", NOTESKIN:get_path(skin_name, "HD/Center ReceptorFactory"), "", ""},
			tap			= NOTESKIN:get_path(skin_name, "HD/Tap")
		},
		StepsType_Pump_Routine = {
			receptor	= {"", "", NOTESKIN:get_path(skin_name, "HD/Routine/Center ReceptorFactory"), "", "", "", "", NOTESKIN:get_path(skin_name, "HD/Routine/Center ReceptorFactory"), "", ""},
			tap			= NOTESKIN:get_path(skin_name, "HD/Routine/Tap")
		},
	};
	
	for i, button in ipairs(button_list) do
		if (i == 3 and stepstype ~= "StepsType_Pump_Halfdouble") or i == 8 or (i == 1 and stepstype == "StepsType_Pump_Halfdouble") or (i == 6 and stepstype == "StepsType_Pump_Halfdouble") then
			ret[i]= Def.ActorFrame{
				Def.Sprite{
					Texture= stepsTypeTable[stepstype].receptor[i],
					InitCommand= function(self) self:animate(false):setstate(0):basezoom(1/1.5) end,
				},
				Def.Sprite{
					Texture= stepsTypeTable[stepstype].receptor[i],
					InitCommand= function(self) self:animate(false):setstate(1):basezoom(1/1.5):blend("BlendMode_Add"):effectclock("beat"):diffuseramp() end,
				},
				Def.Sprite{
					Texture= stepsTypeTable[stepstype].tap,
					InitCommand= function(self) self:draworder(notefield_draw_order.explosion):addy(-1):visible(false):animate(false):setstate(tap_press[button]):basezoom(1/1.5) end,
					
					ColumnJudgmentCommand= function(self, param)
						self.tap_note_score = param.tap_note_score
					end,
					
					BeatUpdateCommand= function(self, param)
						if param.pressed then
							if self.tap_note_score then
								self:stoptweening():visible(false)
							elseif self.tap_note_score == nil then
								self:stoptweening():visible(true):diffusealpha(1):zoom(0.85):linear(0.25):zoom(1.1):diffusealpha(0)
							end
						elseif param.lifted then
							self.tap_note_score = nil
						end
					end
				},
			}
		else
			ret[i]= Def.Sprite{
				Texture= stepsTypeTable[stepstype].tap,
				InitCommand= function(self) self:draworder(notefield_draw_order.explosion):addy(-1):visible(false):animate(false):setstate(tap_press[button]):basezoom(1/1.5) end,
				
				ColumnJudgmentCommand= function(self, param)
					self.tap_note_score = param.tap_note_score
				end,
				
				BeatUpdateCommand= function(self, param)
					if param.pressed then
						if self.tap_note_score then
							self:stoptweening():visible(false)
						elseif self.tap_note_score == nil then
							self:stoptweening():visible(true):diffusealpha(1):zoom(0.85):linear(0.25):zoom(1.1):diffusealpha(0)
						end
					elseif param.lifted then
						self.tap_note_score = nil
					end
				end
			}
		end
	end
	
	return ret
end
